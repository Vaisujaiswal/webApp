import {
  FaChartPie,
  FaBolt,
  FaPlug,
  FaFileAlt,
  FaLeaf,
  FaSignOutAlt
} from "react-icons/fa";
import "../styles/dashboard.css";
import { NavLink } from "react-router-dom";


function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <div>
        <h2>⚡ SmartEnergy</h2>

        <NavLink to="/" end className="menu">
          <FaChartPie /> Dashboard
        </NavLink>

        <NavLink to="/usage" className="menu">
          <FaBolt /> Usage & Costs
        </NavLink>

        <NavLink to="/devices" className="menu">
          <FaPlug /> Devices
        </NavLink>

        <NavLink to="/reports" className="menu">
          <FaFileAlt /> Reports
        </NavLink>

        <NavLink to="/emissions" className="menu">
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
