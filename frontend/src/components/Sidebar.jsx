import { useState } from "react";
import {
  FaChartPie,
  FaBolt,
  FaPlug,
  FaFileAlt,
  FaLeaf,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaUser,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  /* =========================
     RIPPLE EFFECT
  ========================= */
  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  /* =========================
     MENU CONFIG
  ========================= */
  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaChartPie />,
      label: "Dashboard",
      badge: null,
      color: "#00d4ff",
    },
    {
      path: "/dashboard/usage",
      icon: <FaBolt />,
      label: "Usage & Costs",
      badge: null,
      color: "#ffd700",
    },
    {
      path: "/dashboard/devices",
      icon: <FaPlug />,
      label: "Devices",
      // badge: "5",
      color: "#ff6b6b",
    },
    {
      path: "/dashboard/reports",
      icon: <FaFileAlt />,
      label: "Reports",
      badge: null,
      color: "#51cf66",
    },
    {
      path: "/dashboard/emissions",
      icon: <FaLeaf />,
      label: "Emissions",
      // badge: "New",
      // color: "#37b679",
    },
    {
    path: "/dashboard/privacy",
    icon: <FaFileAlt />,
    label: "Privacy Policy",
    badge: null,
    color: "#ff0101",
    },
  ];

  /* =========================
     🔥 REAL LOGOUT (FIXED)
  ========================= */
  const handleLogout = () => {
    // clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // reset app state
    if (onLogout) onLogout();

    // force navigation
    navigate("/login", { replace: true });
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-gradient"></div>
      <div className="sidebar-glow"></div>

      {/* TOP */}
      <div className="sidebar-top">
        {/* LOGO */}
        <div className="sidebar-logo">
          <div className="logo-wrapper">
            <div className="logo-icon">⚡</div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="logo-name">SmartEnergy</span>
                <span className="logo-tagline">Power Insights</span>
              </div>
            )}
          </div>

          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <div className={`collapse-icon ${isCollapsed ? "rotate" : ""}`}>
              ❮
            </div>
          </button>
        </div>

        {/* USER */}
        <div className="sidebar-user">
          {/* <div
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FaUser />
            <div className="user-status"></div>
          </div> */}

          {/* {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">User</span>
              <span className="user-role">Premium Member</span>
            </div>
          )} */}

          {/* {!isCollapsed && (
            <button className="notification-btn" title="Notifications">
              <FaBell />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          )} */}
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed && <span className="nav-label">MAIN MENU</span>}

            {menuItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `menu ${isActive ? "active" : ""}`
                }
                onClick={createRipple}
                style={{
                  "--menu-color": item.color,
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="menu-icon-wrapper">
                  <span className="menu-icon">{item.icon}</span>
                  <div className="icon-glow"></div>
                </div>

                {!isCollapsed && (
                  <>
                    <span className="menu-label">{item.label}</span>
                    {item.badge && (
                      <span className="menu-badge">{item.badge}</span>
                    )}
                  </>
                )}

                <div className="menu-indicator"></div>
              </NavLink>
            ))}
          </div>

          {/* {!isCollapsed && (
            <div className="nav-section quick-actions">
              <span className="nav-label">QUICK ACTIONS</span>
              <button className="quick-action-btn">
                <FaFileAlt />
                <span>privacy policy</span>
              </button>
            </div>
          )} */}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        {!isCollapsed && (
          <div className="sidebar-stats">
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-label">Today's Usage</span>
                <span className="stat-value">32.5 kWh</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "65%" }}></div>
            </div>
            <span className="stat-note">65% of daily target</span>
          </div>
        )}

        {/* 🔥 WORKING LOGOUT */}
        <button className="logout" onClick={handleLogout} title="Logout">
          <div className="logout-icon">
            <FaSignOutAlt />
          </div>
          {!isCollapsed && <span className="logout-text">Logout</span>}
          <div className="logout-glow"></div>
        </button>

        {!isCollapsed && (
          <div className="sidebar-version">
            <span>Version 2.0.1</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
