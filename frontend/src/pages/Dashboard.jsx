
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "../styles/dashboard.css";

import DashboardHome from "./DashboardHome";
import UsageCosts from "./UsageCosts";
import Devices from "./Devices";
import Reports from "./Reports";
import Emissions from "./Emissions";
import PrivacyPolicy from "./privacy";
import ContactUs from "./ContactUs";


/* =========================
   JWT DECODE (no library)
========================= */
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      onLogout();
      navigate("/login", { replace: true });
      return;
    }

    const decoded = decodeJWT(token);

    if (!decoded || !decoded.exp) {
      onLogout();
      navigate("/login", { replace: true });
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeLeft = expiryTime - currentTime;

    if (timeLeft <= 0) {
      onLogout();
      navigate("/login", { replace: true });
      return;
    }

    const logoutTimer = setTimeout(() => {
      onLogout();
      navigate("/login", { replace: true });
    }, timeLeft);

    return () => clearTimeout(logoutTimer);
  }, [onLogout, navigate]);

  return (
    <div className="app">
      <Sidebar onLogout={onLogout} />

      <div className="main">
        <TopBar />

        {/* ONLY THIS AREA SCROLLS */}
        <div className="page-content">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="usage" element={<UsageCosts />} />
            <Route path="devices" element={<Devices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="contact" element={<ContactUs />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
