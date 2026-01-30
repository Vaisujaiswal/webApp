// import "../styles/dashboard.css";

// function TopBar() {
//   return (
//     <div className="topbar">
//       <input placeholder="Search..." />
//       <span>👤 User</span>
//     </div>
//   );
// }

// const styles = {
//   topbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "15px",
//     background: "#1e293b",
//     color: "#fff"
//   },
//   search: {
//     padding: "8px",
//     width: "200px"
//   }
// };

// export default TopBar;


















import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/dashboard.css";

/* =========================
   PAGE CONTEXT CONFIG
========================= */
const pageConfig = {
  "/dashboard": {
    title: "Dashboard Overview",
    search: "Search insights, stats...",
  },
  "/dashboard/usage": {
    title: "Usage & Costs",
    search: "Search usage data...",
  },
  "/dashboard/devices": {
    title: "Devices",
    search: "Search connected devices...",
  },
  "/dashboard/reports": {
    title: "Reports",
    search: "Search reports...",
  },
  "/dashboard/emissions": {
    title: "Emissions",
    search: "Search emission data...",
  },
};

function TopBar() {
  const location = useLocation();

  const current =
    pageConfig[location.pathname] || pageConfig["/dashboard"];

  /* =========================
     THEME STATE
  ========================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="topbar">
      <div>
        <h3 style={{ color: "#e5e7eb", fontWeight: 500 }}>
          {current.title}
        </h3>
      </div>

      <input
        className="topbar-search"
        placeholder={current.search}
      />

      <div className="topbar-user">
        {/* 🌗 THEME TOGGLE */}
        <span
          style={{
            cursor: "pointer",
            fontSize: "18px",
            marginRight: "10px",
          }}
          title="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </span>

        <span className="user-avatar">👤</span>
        <span className="user-name">User</span>
      </div>
    </div>
  );
}

export default TopBar;

