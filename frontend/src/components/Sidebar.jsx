import {
  FaChartPie,
  FaBolt,
  FaPlug,
  FaFileAlt,
  FaLeaf
} from "react-icons/fa";
import "../styles/dashboard.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>⚡ SmartEnergy</h2>

      <p><FaChartPie /> Dashboard</p>
      <p><FaBolt /> Usage & Costs</p>
      <p><FaPlug /> Devices</p>
      <p><FaFileAlt /> Reports</p>
      <p><FaLeaf /> Emissions</p>
    </div>
  );
}

export default Sidebar;
