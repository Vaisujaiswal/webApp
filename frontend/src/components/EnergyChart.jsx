import { useEffect, useState, useMemo } from "react";
import "../styles/dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

function EnergyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEnergyData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/energy/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch energy chart data");
        }

        const raw = await res.json();

        /* =========================
           GROUP BY HOUR (0–23)
        ========================= */
        const hourMap = {};

        raw.forEach((item) => {
          const hour = new Date(item.date).getHours();

          if (!hourMap[hour]) {
            hourMap[hour] = 0;
          }

          hourMap[hour] += Number(item.usage);
        });

        /* =========================
           NORMALIZE → 24 HOURS
        ========================= */
        const formatted = Array.from({ length: 24 }, (_, h) => ({
          hour: `${String(h).padStart(2, "0")}:00`,
          usage: Number((hourMap[h] || 0).toFixed(2)),
        }));

        if (isMounted) {
          setData(formatted);
        }
      } catch (err) {
        console.error("ENERGY CHART ERROR:", err);
        if (isMounted) setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEnergyData();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => data, [data]);

  return (
    <div className="chart-card">
      <h3>Energy Usage</h3>

      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading chart…</p>
      ) : chartData.every((d) => d.usage === 0) ? (
        <p style={{ opacity: 0.6 }}>
          No energy data available for today
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              interval={2} // ✅ less clutter
            />
            <YAxis
              stroke="#94a3b8"
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [`${value} kWh`, "Usage"]}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default EnergyChart;
