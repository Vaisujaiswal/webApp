// import { useState } from "react";
// import "../styles/auth.css";

// function Login({ onLogin }) {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const handleLogin = (e) => {
//         e.preventDefault();

//         const savedUser = JSON.parse(localStorage.getItem("user"));

//         if (!savedUser) {
//             setError("No user found. Please register first.");
//             return;
//         }

//         if (email !== savedUser.email || password !== savedUser.password) {
//             setError("Invalid email or password");
//             return;
//         }

//         onLogin(savedUser.role);
//     };

//     return (
//         <div className="auth-container">
//             <form className="auth-card" onSubmit={handleLogin}>
//                 <h2>Login</h2>

//                 {error && <p className="error">{error}</p>}

//                 <input
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <button type="submit">Login</button>

//                 <span
//                     style={{ color: "#38bdf8", cursor: "pointer" }}
//                     onClick={() => window.location.reload()}
//                 >
//                     Register
//                 </span>

//             </form>
//         </div>
//     );
// }

// export default Login;
























import { useState } from "react";
import "../styles/auth.css";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      setError("No user found. Please register first.");
      return;
    }

    if (email !== savedUser.email || password !== savedUser.password) {
      setError("Invalid email or password");
      return;
    }

    onLogin(savedUser.role);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#38bdf8", cursor: "pointer" }}
            onClick={onRegister}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
