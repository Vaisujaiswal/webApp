import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { loginUser } from "../services/authService";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      /**
       * EXPECTED backend response:
       * {
       *   token: "JWT_TOKEN",
       *   user: {
       *     id,
       *     email,
       *     role
       *   }
       * }
       */
      const data = await loginUser({ email, password });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid login response");
      }

      // 🔐 store JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // update app auth state
      onLogin(data.user);

      // 🚀 redirect
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={(e) => e.preventDefault()}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#38bdf8" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
