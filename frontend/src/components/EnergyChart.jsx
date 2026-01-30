import "../styles/dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { energyData } from "../data/energyData";

function EnergyChart() {
  return (
    <div className="chart-card">
      <h3>Energy Usage</h3>
      <LineChart width={500} height={260} data={energyData}>
        <XAxis dataKey="hour" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Line type="monotone" dataKey="usage" stroke="#38bdf8" strokeWidth={3} />
      </LineChart>
    </div>
  );
}

export default EnergyChart;
