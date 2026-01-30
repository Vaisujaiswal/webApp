

// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "../styles/dashboard.css";
// import { FaLeaf } from "react-icons/fa";

// function TopBar() {
//   const location = useLocation();

//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "dark"
//   );

//   useEffect(() => {
//     document.body.classList.remove("light", "dark");
//     document.body.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   return (
//     <div className="topbar">
//       <div className="header-content">
//         <h1 className="dashboard-title">
//           <span className="title-icon">⚡</span>
//           Energy Overview
//         </h1>
//       </div>

//       <div className="topbar-right">
//         {/* 🌗 THEME TOGGLE */}
//         <span
//           style={{
//             cursor: "pointer",
//             fontSize: "25px",
//             marginRight: "60px",
//           }}
//           title="Toggle theme"
//           onClick={toggleTheme}
//         >
//           {theme === "dark" ? "🌙" : "☀️"}
//         </span>

//         <span className="user-avatar">👤</span>
//         <span className="user-name">User</span>
//       </div>
//     </div>
//   );
// }

// export default TopBar;




// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "../styles/dashboard.css";

// /* =========================
//    JWT DECODE
// ========================= */
// const getUserFromToken = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   try {
//     const payload = token.split(".")[1];
//     return JSON.parse(atob(payload));
//   } catch {
//     return null;
//   }
// };

// function TopBar() {
//   const location = useLocation();

//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "dark"
//   );

//   const [user, setUser] = useState(null);

//   /* THEME */
//   useEffect(() => {
//     document.body.classList.remove("light", "dark");
//     document.body.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   /* USER */
//   useEffect(() => {
//     const decodedUser = getUserFromToken();
//     setUser(decodedUser);
//   }, []);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   return (
//     <div className="topbar">
//       <div className="header-content">
//         <h1 className="dashboard-title">
//           <span className="title-icon">⚡</span>
//           Energy Overview
//         </h1>
//       </div>

//       <div className="topbar-right">
//         {/* 🌗 THEME TOGGLE */}
//         <span
//           style={{
//             cursor: "pointer",
//             fontSize: "25px",
//             marginRight: "30px",
//           }}
//           title="Toggle theme"
//           onClick={toggleTheme}
//         >
//           {theme === "dark" ? "🌙" : "☀️"}
//         </span>

//         {/* 👤 USER */}
//         <span className="user-avatar">👤</span>
//         <span className="user-name">
//           {user?.name || "Guest"}
//         </span>
//       </div>
//     </div>
//   );
// }

// export default TopBar;





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
        <span
          style={{ cursor: "pointer", fontSize: "25px", marginRight: "30px" }}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </span>

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
