import {
  FaChartPie,
  FaBolt,
  FaPlug,
  FaFileAlt,
  FaLeaf,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <div>
        <h2>⚡SmartEnergy</h2>

        <NavLink to="/dashboard" end className="menu">
          <FaChartPie /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/usage" className="menu">
          <FaBolt /> Usage & Costs
        </NavLink>

        <NavLink to="/dashboard/devices" className="menu">
          <FaPlug /> Devices
        </NavLink>

        <NavLink to="/dashboard/reports" className="menu">
          <FaFileAlt /> Reports
        </NavLink>

        <NavLink to="/dashboard/emissions" className="menu">
          <FaLeaf /> Emissions
        </NavLink>
      </div>

      <p className="logout" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </p>
    </div>
  );
}

export default Sidebar;
