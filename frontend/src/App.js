
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRole(null);
    setPage("login");
  };

  if (role) {
    return <Dashboard role={role} onLogout={handleLogout} />;
  }

  return page === "login" ? (
    <Login
      onLogin={setRole}
      onRegister={() => setPage("register")}
    />
  ) : (
    <Register onFinish={setRole} />
  );
}

export default App;
