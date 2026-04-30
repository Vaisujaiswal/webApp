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
  Legend,
} from "recharts";
import "../styles/dashboard.css";
import { useEffect, useState, useMemo } from "react";

const API_BASE = "http://localhost:5000/api";

function Reports() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* =========================
     LOAD DEVICES (BACKEND)
  ========================= */
  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async () => {
      try {
        const res = await fetch(`${API_BASE}/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch devices");

        const data = await res.json();
        if (isMounted) setDevices(data);
      } catch (err) {
        console.error("REPORTS DEVICE FETCH ERROR:", err);
        if (isMounted) setDevices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) fetchDevices();

    return () => {
      isMounted = false;
    };
  }, [token]);

  /* =========================
     DAILY USAGE PER DEVICE
  ========================= */
  const deviceUsage = useMemo(() => {
    return devices.map((d) => ({
      name: d.name,
      usage: Number(((d.power * d.hoursPerDay) / 1000).toFixed(2)),
    }));
  }, [devices]);

  const totalDailyUnits = useMemo(() => {
    return deviceUsage.reduce((sum, d) => sum + d.usage, 0);
  }, [deviceUsage]);

  /* =========================
     MONTHLY TREND (DERIVED)
     (Placeholder – backend next)
  ========================= */
  const monthlyTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", {
        month: "short",
      }),
      units: Number((totalDailyUnits * (24 + i)).toFixed(1)),
    }));
  }, [totalDailyUnits]);

  /* =========================
     COST BREAKDOWN
  ========================= */
  const TARIFF = 7;

  const costData = useMemo(() => {
    return deviceUsage
      .filter((d) => d.usage > 0)
      .map((d) => ({
        name: d.name,
        value: Number((d.usage * TARIFF * 30).toFixed(2)),
      }));
  }, [deviceUsage]);

  const COLORS = [
    "#38bdf8",
    "#22c55e",
    "#facc15",
    "#f87171",
    "#a78bfa",
  ];

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

          {loading ? (
            <p style={{ opacity: 0.6 }}>Loading…</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deviceUsage}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="usage"
                  fill="#38bdf8"
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Monthly Consumption Trend</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="units"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="chart-card" style={{ marginTop: "25px" }}>
        <h3>Cost Breakdown by Device (Monthly)</h3>

        {loading || costData.length === 0 ? (
          <p style={{ opacity: 0.7 }}>
            Add devices to see reports.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
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
