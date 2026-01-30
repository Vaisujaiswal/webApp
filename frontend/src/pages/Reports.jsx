import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../styles/dashboard.css";
import { useEffect, useState } from "react";

function Reports() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const loadDevices = () => {
      const data = JSON.parse(localStorage.getItem("devices")) || [];
      setDevices(data);
    };

    loadDevices();
    window.addEventListener("storage", loadDevices);

    return () => window.removeEventListener("storage", loadDevices);
  }, []);

  // DAILY USAGE PER DEVICE (kWh)
  const deviceUsage = devices.map((d) => ({
    name: d.name,
    usage: (d.power * d.hours) / 1000
  }));

  const totalDailyUnits = deviceUsage.reduce(
    (sum, d) => sum + d.usage,
    0
  );

  // MONTHLY TREND (derived)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    units: +(totalDailyUnits * (24 + i)).toFixed(1)
  }));


  // COST BREAKDOWN
  const TARIFF = 7;
  const costData = deviceUsage
    .filter(d => d.usage > 0)
    .map(d => ({
      name: d.name,
      value: +(d.usage * TARIFF * 30).toFixed(2)
    }));


  const COLORS = ["#38bdf8", "#22c55e", "#facc15", "#f87171", "#a78bfa"];

  return (
    <div style={{ padding: "25px" }}>
      <h2>Energy Reports</h2>
      <p>Detailed energy usage analytics and insights.</p>

      {/* SUMMARY */}
      <div className="stats">
        <div className="stat-card">
          <h4>Daily Consumption</h4>
          <h2>{totalDailyUnits.toFixed(2)} kWh</h2>
        </div>

        <div className="stat-card">
          <h4>Monthly Consumption</h4>
          <h2>{(totalDailyUnits * 30).toFixed(1)} kWh</h2>
        </div>

        <div className="stat-card">
          <h4>Estimated Monthly Cost</h4>
          <h2>₹{(totalDailyUnits * 30 * TARIFF).toFixed(0)}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="content">
        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Daily Energy Usage by Device</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deviceUsage}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#38bdf8" animationDuration={1200} />
            </BarChart>

          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Monthly Consumption Trend</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="units"
                stroke="#22c55e"
                strokeWidth={3}
                animationDuration={1500}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="chart-card" style={{ marginTop: "25px" }}>
        <h3>Cost Breakdown by Device (Monthly)</h3>

        {devices.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Add devices to see reports.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                animationBegin={200}
                animationDuration={1400}
              >

                {costData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}


      </div>
    </div>
  );
}

export default Reports;
