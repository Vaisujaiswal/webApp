

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "../styles/dashboard.css";

import { Routes, Route } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import UsageCosts from "./UsageCosts";
import Devices from "./Devices";
import Reports from "./Reports";
import Emissions from "./Emissions";

function Dashboard({ role, onLogout }) {
  return (
    <div className="app">
      <Sidebar onLogout={onLogout} />

      <div className="main">
        <TopBar />

        {/* PAGE CONTENT CHANGES HERE */}
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/usage" element={<UsageCosts />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/emissions" element={<Emissions />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
