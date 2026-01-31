import { useEffect, useState } from "react";
import "../styles/dashboard.css";

/* =========================
   SAFE USER RESOLVER
========================= */
const getUser = () => {
  // 1️⃣ Try JWT
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.name) return payload;
    } catch {}
  }

  // 2️⃣ Fallback to stored user
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {}
  }

  return null;
};

function TopBar() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [user, setUser] = useState(null);

  /* THEME */
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* USER */
  useEffect(() => {
    setUser(getUser());
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="topbar">
      <div className="header-content">
        <h1 className="dashboard-title">
          <span className="title-icon">⚡</span>
          Energy Overview
        </h1>
      </div>

      <div className="topbar-right">
        {/* 🌗 THEME */}
        {/* <span
          style={{ cursor: "pointer", fontSize: "25px", marginRight: "30px" }}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </span> */}

        {/* 👤 USER */}
        <span className="user-avatar">👤</span>
        <span className="user-name">
          {user?.name || "Guest"}
        </span>
      </div>
    </div>
  );
}

export default TopBar;


