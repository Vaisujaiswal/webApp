// import Dashboard from "./pages/Dashboard";
// import Register from "./pages/Register";

// function App() {
//   // return <Dashboard />;
//   return <Register />;
// }

// export default App;










import { useState } from "react";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [role, setRole] = useState(null);

  return role ? <Dashboard role={role} /> : <Register onFinish={setRole} />;
}

export default App;

