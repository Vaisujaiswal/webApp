


// import { useState } from "react";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const [role, setRole] = useState(null);

//   return role ? <Dashboard role={role} /> : <Register onFinish={setRole} />;
// }

// export default App;













// import { useState } from "react";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const [role, setRole] = useState(null);
//   const [page, setPage] = useState("login"); // login | register

//   if (role) return <Dashboard role={role} />;

//   return page === "login" ? (
//     <Login onLogin={setRole} />
//   ) : (
//     <Register onFinish={setRole} />
//   );
// }

// export default App;













import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");

  if (role) return <Dashboard role={role} />;

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
