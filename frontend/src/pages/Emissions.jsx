// import { useState } from "react";
// import "../styles/dashboard.css";
// import {
//   FaLeaf,
//   FaBolt,
//   FaCar,
//   FaTree
// } from "react-icons/fa";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";

// function Emissions() {
//   // REAL DATA
//   const monthlyUnits = Number(localStorage.getItem("monthlyUnits")) || 59;

//   const EMISSION_FACTOR = 0.82; // kg CO2 per kWh (India avg)

//   const totalCO2 = monthlyUnits * EMISSION_FACTOR;

//   // Real-world equivalents
//   const drivingKm = totalCO2 * 4.3; // approx km driven per kg CO2
//   const treesNeeded = Math.ceil(totalCO2 / 21); // 1 tree absorbs ~21kg CO2/year

//   // What-if savings
//   const [reduction, setReduction] = useState(0);

//   const reducedUnits = Math.max(monthlyUnits - reduction, 0);
//   const reducedCO2 = reducedUnits * EMISSION_FACTOR;

//   // Trend (derived, not dummy)
//   const trendData = [
//     { month: "Jan", co2: totalCO2 * 0.7 },
//     { month: "Feb", co2: totalCO2 * 0.8 },
//     { month: "Mar", co2: totalCO2 * 0.9 },
//     { month: "This Month", co2: totalCO2 }
//   ];

//   return (
//     <div style={{ padding: "25px" }}>
//       {/* TOP CARD */}
//       <div className="stat-card" style={{ maxWidth: "700px" }}>
//         <h3><FaLeaf /> Your Carbon Emission</h3>
//         <h1 style={{ color: "#22c55e" }}>
//           {totalCO2.toFixed(1)} kg CO₂
//         </h1>
//         <p>This Month</p>

//         <div style={{ display: "flex", gap: "30px", marginTop: "15px" }}>
//           <p><FaCar /> Driving: {drivingKm.toFixed(0)} km</p>
//           <p><FaTree /> Trees needed: {treesNeeded}</p>
//         </div>
//       </div>

//       {/* GRID */}
//       <div className="content">
//         {/* TREND */}
//         <div className="chart-card">
//           <h3>Emissions Trend</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={trendData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="co2"
//                 stroke="#22c55e"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* BREAKDOWN */}
//         <div className="chart-card">
//           <h3><FaBolt /> Electricity Breakdown</h3>
//           <p>Total Usage: <strong>{monthlyUnits} kWh</strong></p>
//           <p>Energy Source: <strong>Coal-based</strong></p>
//           <p>Emission Factor: <strong>0.82 kg CO₂ / kWh</strong></p>
//         </div>
//       </div>

//       {/* WHAT IF */}
//       <div className="chart-card" style={{ marginTop: "25px" }}>
//         <h3>What if you save electricity?</h3>

//         <input
//           type="range"
//           min="0"
//           max={monthlyUnits}
//           value={reduction}
//           onChange={(e) => setReduction(Number(e.target.value))}
//         />

//         <p>
//           Reduce units per month: <strong>{reduction}</strong>
//         </p>

//         <p>
//           Saving:{" "}
//           <strong>
//             {(totalCO2 - reducedCO2).toFixed(1)} kg CO₂
//           </strong>
//         </p>
//       </div>

//       {/* TIPS */}
//       <div className="chart-card" style={{ marginTop: "25px" }}>
//         <h3>Tips to Reduce Emissions</h3>

//         <p>🌱 Set AC to 24–26°C → Save ~6 kg CO₂</p>
//         <p>💡 Switch to LED bulbs → Save ~3 kg CO₂</p>
//         <p>🔌 Turn off standby devices → Save ~2 kg CO₂</p>
//       </div>
//     </div>
//   );
// }

// export default Emissions;





























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
  ResponsiveContainer
} from "recharts";

const API_BASE = "http://localhost:5000/api";

function Emissions() {
  const [data, setData] = useState(null);
  const [reduction, setReduction] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEmissions = async () => {
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
        if (isMounted) setData(result);
      } catch (err) {
        console.error("EMISSIONS ERROR:", err);
        if (isMounted) setError("Unable to load emissions data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEmissions();
    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================
     DERIVED VALUES
  ========================= */
  const reducedUnits = useMemo(() => {
    if (!data) return 0;
    return Math.max(
      Math.min(data.monthlyUnits - reduction, data.monthlyUnits),
      0
    );
  }, [data, reduction]);

  const reducedCO2 = useMemo(() => {
    if (!data) return 0;
    return reducedUnits * data.emissionFactor;
  }, [data, reducedUnits]);

  const savingPercent = useMemo(() => {
    if (!data || data.totalCO2 === 0) return 0;
    return (
      ((data.totalCO2 - reducedCO2) / data.totalCO2) * 100
    ).toFixed(1);
  }, [data, reducedCO2]);

  if (loading) {
    return <p style={{ padding: 25, opacity: 0.7 }}>Loading emissions…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 25 }} className="error">
        {error}
      </p>
    );
  }

  if (!data) return null;

  return (
    <div className="emission-page">
      {/* SUMMARY */}
      <div className="emission-summary">
        <h3><FaLeaf /> Your Carbon Emission</h3>
        <h1>{data.totalCO2.toFixed(1)} kg CO₂</h1>
        <p>This Month</p>

        <div className="emission-metrics">
          <div><FaCar /> Driving: {data.drivingKm.toFixed(0)} km</div>
          <div><FaTree /> Trees needed: {data.treesNeeded}</div>
        </div>
      </div>

      {/* GRID */}
      <div className="emission-grid">
        {/* TREND */}
        <div className="chart-card">
          <h3>Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.trend || []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
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
          <h3><FaBolt /> Electricity Breakdown</h3>
          <p><strong>Total Usage:</strong> {data.monthlyUnits} kWh</p>
          <p><strong>Energy Source:</strong> Coal-based</p>
          <p>
            <strong>Emission Factor:</strong>{" "}
            {data.emissionFactor} kg CO₂ / kWh
          </p>
        </div>
      </div>

      {/* WHAT IF */}
      <div className="chart-card">
        <h3>What if you save electricity?</h3>

        <input
          type="range"
          min="0"
          max={data.monthlyUnits}
          value={reduction}
          onChange={(e) => setReduction(Number(e.target.value))}
        />

        <p>
          Reduce units per month: <strong>{reduction}</strong>
        </p>
        <p>
          CO₂ Saved:{" "}
          <strong>{(data.totalCO2 - reducedCO2).toFixed(1)} kg</strong>{" "}
          ({savingPercent}%)
        </p>
      </div>

      {/* AI TIPS */}
      <div className="chart-card">
        <h3>Tips to Reduce Emissions</h3>
        <ul className="emission-tips">
          {(data.aiTips || []).map((tip, i) => (
            <li key={i}>
              🌱 {tip.text} → Save ~{tip.impactKg} kg CO₂
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Emissions;


