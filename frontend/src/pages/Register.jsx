import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { registerUser } from "../services/authService";

function Register({ onFinish }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const finish = async () => {
    try {
      setLoading(true);

      const payload = {
        role,
        ...form,
      };

      
        // EXPECTED backend response:
        // {
        //   token: "JWT_TOKEN",
        //   user: {
        //     id,
        //     email,
        //     role
        //   }
        // }
    
      const data = await registerUser(payload);

      if (!data?.token || !data?.user) {
        throw new Error("Invalid registration response");
      }

      // 🔐 store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // update app auth state
      onFinish(data.user);

      // 🚀 redirect
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registration</h2>

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <>
            <h4>Select Role</h4>
            <button onClick={() => { setRole("home"); next(); }}>
              Home User
            </button>
            <button onClick={() => { setRole("industry"); next(); }}>
              Industry User
            </button>
            <button onClick={() => { setRole("discom"); next(); }}>
              DISCOM / Admin
            </button>
          </>
        )}

        {/* STEP 2: COMMON DETAILS */}
        {step === 2 && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}

        {/* STEP 3: HOME USER */}
        {step === 3 && role === "home" && (
          <>
            <input
              name="city"
              placeholder="City / Location"
              onChange={handleChange}
            />
            <select name="houseType" onChange={handleChange}>
              <option value="">House Type</option>
              <option value="Flat">Flat</option>
              <option value="Independent">Independent</option>
            </select>
            <input
              name="monthlyUnits"
              placeholder="Avg Monthly Units (optional)"
              onChange={handleChange}
            />
            <select name="provider" onChange={handleChange}>
              <option value="">Electricity Provider</option>
              <option value="Tata">Tata</option>
              <option value="Adani">Adani</option>
              <option value="BEST">BEST</option>
            </select>

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish} disabled={loading}>
                {loading ? "Saving..." : "Finish"}
              </button>
            </div>
          </>
        )}

        {/* STEP 3: INDUSTRY USER */}
        {step === 3 && role === "industry" && (
          <>
            <input
              name="industryName"
              placeholder="Industry Name"
              onChange={handleChange}
            />
            <select name="industryType" onChange={handleChange}>
              <option value="">Industry Type</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="IT">IT</option>
              <option value="Textile">Textile</option>
            </select>
            <input
              name="shifts"
              placeholder="Operating Hours / Shifts"
              onChange={handleChange}
            />
            <input
              name="monthlyUnits"
              placeholder="Approx Monthly Units"
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City / Industrial Area"
              onChange={handleChange}
            />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish} disabled={loading}>
                {loading ? "Saving..." : "Finish"}
              </button>
            </div>
          </>
        )}

        {/* STEP 3: DISCOM */}
        {step === 3 && role === "discom" && (
          <>
            <input
              name="orgName"
              placeholder="Organization Name"
              onChange={handleChange}
            />
            <input
              name="designation"
              placeholder="Designation"
              onChange={handleChange}
            />
            <input
              name="region"
              placeholder="Region / City"
              onChange={handleChange}
            />
            <input
              name="accessCode"
              placeholder="Admin Access Code (optional)"
              onChange={handleChange}
            />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish} disabled={loading}>
                {loading ? "Saving..." : "Finish"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
