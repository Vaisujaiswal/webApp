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





























import { useState } from "react";
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

function Emissions() {
  // REAL DATA
  const monthlyUnits = Number(localStorage.getItem("monthlyUnits")) || 59;
  const EMISSION_FACTOR = 0.82;

  const totalCO2 = monthlyUnits * EMISSION_FACTOR;
  const drivingKm = totalCO2 * 4.3;
  const treesNeeded = Math.ceil(totalCO2 / 21);

  const [reduction, setReduction] = useState(0);
  const reducedUnits = Math.max(monthlyUnits - reduction, 0);
  const reducedCO2 = reducedUnits * EMISSION_FACTOR;

  const trendData = [
    { month: "Jan", co2: totalCO2 * 0.7 },
    { month: "Feb", co2: totalCO2 * 0.8 },
    { month: "Mar", co2: totalCO2 * 0.9 },
    { month: "This Month", co2: totalCO2 }
  ];

  return (
    <div className="emission-page">

      {/* SUMMARY */}
      <div className="emission-summary">
        <h3><FaLeaf /> Your Carbon Emission</h3>
        <h1>{totalCO2.toFixed(1)} kg CO₂</h1>
        <p>This Month</p>

        <div className="emission-metrics">
          <div><FaCar /> Driving: {drivingKm.toFixed(0)} km</div>
          <div><FaTree /> Trees needed: {treesNeeded}</div>
        </div>
      </div>

      {/* GRID */}
      <div className="emission-grid">

        {/* TREND */}
        <div className="chart-card">
          <h3>Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="co2"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BREAKDOWN */}
        <div className="chart-card">
          <h3><FaBolt /> Electricity Breakdown</h3>
          <p><strong>Total Usage:</strong> {monthlyUnits} kWh</p>
          <p><strong>Energy Source:</strong> Coal-based</p>
          <p><strong>Emission Factor:</strong> 0.82 kg CO₂ / kWh</p>
        </div>

      </div>

      {/* WHAT IF */}
      <div className="chart-card">
        <h3>What if you save electricity?</h3>

        <input
          type="range"
          min="0"
          max={monthlyUnits}
          value={reduction}
          onChange={(e) => setReduction(Number(e.target.value))}
        />

        <p>Reduce units per month: <strong>{reduction}</strong></p>
        <p>Saving: <strong>{(totalCO2 - reducedCO2).toFixed(1)} kg CO₂</strong></p>
      </div>

      {/* TIPS */}
      <div className="chart-card">
        <h3>Tips to Reduce Emissions</h3>
        <ul className="emission-tips">
          <li>🌱 Set AC to 24–26°C → Save ~6 kg CO₂</li>
          <li>💡 Switch to LED bulbs → Save ~3 kg CO₂</li>
          <li>🔌 Turn off standby devices → Save ~2 kg CO₂</li>
        </ul>
      </div>

    </div>
  );
}

export default Emissions;
