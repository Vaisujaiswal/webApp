import { useEffect, useState, useMemo } from "react";
import "../styles/dashboard.css";

// ICONS
import { FaLeaf, FaBolt, FaCar, FaTree } from "react-icons/fa";

// CHARTS
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEnergyReports } from "../hooks/useEnergyReports";

const API_BASE = "http://localhost:5000/api";

function Emissions() {
  const { loading: energyLoading, monthlyUnits = 0 } = useEnergyReports();

  const [meta, setMeta] = useState(null);
  const [reduction, setReduction] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
      FETCH EMISSION META
  ========================= */
  useEffect(() => {
    let isMounted = true;

    const fetchEmissionMeta = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Auth missing");

        const res = await fetch(`${API_BASE}/emissions/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load emissions data");
        }

        const result = await res.json();
        if (isMounted) setMeta(result);
      } catch (err) {
        console.error("EMISSIONS ERROR:", err);
        if (isMounted) setError("Unable to load emissions data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEmissionMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================
      DERIVED VALUES
  ========================= */
  const emissionFactor = meta?.emissionFactor || 0.82;

  // Total CO2 based on current monthly units
  const totalCO2 = useMemo(() => {
    return (monthlyUnits || 0) * emissionFactor;
  }, [monthlyUnits, emissionFactor]);

  // CO2 that would be saved based on the slider
  const savedCO2 = useMemo(() => {
    return reduction * emissionFactor;
  }, [reduction, emissionFactor]);

  const savingPercent = useMemo(() => {
    if (totalCO2 === 0) return 0;
    return ((savedCO2 / totalCO2) * 100).toFixed(1);
  }, [totalCO2, savedCO2]);

  /* =========================
      TREND (DERIVED)
  ========================= */
  const trend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", {
        month: "short",
      }),
      co2: Number((totalCO2 * (0.8 + i * 0.05)).toFixed(1)),
    }));
  }, [totalCO2]);

  if (loading || energyLoading) {
    return (
      <p style={{ padding: 25, opacity: 0.7 }}>
        Loading emissions…
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ padding: 25 }} className="error">
        {error}
      </p>
    );
  }

  if (!meta) return null;

  return (
    <div className="emission-page">
      {/* SUMMARY */}
      <div className="emission-summary">
        <h3>
          <FaLeaf /> Your Carbon Emission
        </h3>
        <h1>{totalCO2.toFixed(1)} kg CO₂</h1>
        <p>This Month ({monthlyUnits} kWh)</p>

        <div className="emission-metrics">
          <div>
            <FaCar /> Driving: {(totalCO2 * 4).toFixed(0)} km
          </div>
          <div>
            <FaTree /> Trees needed: {Math.ceil(totalCO2 / 21)}
          </div>
        </div>
      </div>

      <div className="emission-grid">
        {/* TREND */}
        <div className="chart-card">
          <h3>Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <XAxis dataKey="month" />
              <YAxis />
              {/* <Tooltip /> */}
              <Tooltip
  formatter={(value) => [`${value} kg CO₂`, "Emissions"]}
  contentStyle={{
    backgroundColor: "#020617",   // dark glass
    border: "1px solid #22c55e",  // green border
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
  }}
  labelStyle={{
    color: "#22c55e",             // ✅ MONTH COLOR
    fontWeight: "600",
    marginBottom: "4px",
  }}
/>

              <Line
                type="monotone"
                dataKey="co2"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BREAKDOWN */}
        <div className="chart-card">
          <h3>
            <FaBolt /> Electricity Breakdown
          </h3>
          <p>
            <strong>Total Usage:</strong> {monthlyUnits.toFixed(1)} kWh
          </p>
          <p>
            <strong>Energy Source:</strong> Coal-based (India avg)
          </p>
          <p>
            <strong>Emission Factor:</strong> {emissionFactor} kg CO₂ / kWh
          </p>
        </div>
      </div>

      {/* WHAT IF - FIXED SLIDER SECTION */}
      <div className="chart-card">
        <h3>What if you save electricity?</h3>

        <input
          type="range"
          min="0"
          max={monthlyUnits > 0 ? monthlyUnits : 100} 
          step="1"
          value={reduction}
          onChange={(e) => setReduction(Number(e.target.value))}
          style={{ width: "100%", cursor: "pointer", accentColor: "#22c55e" }}
        />

        <div style={{ marginTop: "15px" }}>
          <p>
            Reduce units per month: <strong>{reduction} kWh</strong>
          </p>
          <p style={{ color: "#22c55e", fontSize: "1.1rem" }}>
            Potential CO₂ Saved: <strong>{savedCO2.toFixed(1)} kg</strong> ({savingPercent}%)
          </p>
        </div>
      </div>

      {/* AI TIPS */}
      <div className="chart-card">
        <h3>Tips to Reduce Emissions</h3>
        <ul className="emission-tips">
          {(meta.aiTips || []).map((tip, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>
              🌱 {tip.text} → <span style={{ color: "#22c55e" }}>Save ~{tip.impactKg} kg CO₂</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Emissions;