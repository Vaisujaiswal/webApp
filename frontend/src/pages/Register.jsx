// import { useState } from "react";
// import "../styles/auth.css";

// function Register() {
//   const [role, setRole] = useState("");
//   const [form, setForm] = useState({});
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.name || !form.email || !form.password || !form.confirmPassword || !role) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     const userData = { ...form, role };
//     localStorage.setItem("user", JSON.stringify(userData));

//     alert("Registration Successful!");
//     console.log("Saved User:", userData);
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h2>Register</h2>

//         {error && <p className="error">{error}</p>}

//         {/* COMMON FIELDS */}
//         <input name="name" placeholder="Full Name" onChange={handleChange} />
//         <input name="email" placeholder="Email" onChange={handleChange} />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} />
//         <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

//         {/* ROLE SELECTION */}
//         <select onChange={(e) => setRole(e.target.value)}>
//           <option value="">Select Role</option>
//           <option value="home">Home User</option>
//           <option value="industry">Industry User</option>
//           <option value="discom">DISCOM / Admin</option>
//         </select>

//         {/* HOME USER FIELDS */}
//         {role === "home" && (
//           <>
//             <input name="city" placeholder="City" onChange={handleChange} />
//             <select name="houseType" onChange={handleChange}>
//               <option value="">House Type</option>
//               <option value="flat">Flat</option>
//               <option value="independent">Independent</option>
//             </select>
//             <input name="monthlyUnits" placeholder="Avg Monthly Units (optional)" onChange={handleChange} />
//             <select name="provider" onChange={handleChange}>
//               <option value="">Electricity Provider</option>
//               <option value="Tata">Tata Power</option>
//               <option value="Adani">Adani</option>
//               <option value="BEST">BEST</option>
//             </select>
//           </>
//         )}

//         {/* INDUSTRY USER FIELDS */}
//         {role === "industry" && (
//           <>
//             <input name="industryName" placeholder="Industry Name" onChange={handleChange} />
//             <select name="industryType" onChange={handleChange}>
//               <option value="">Industry Type</option>
//               <option value="Manufacturing">Manufacturing</option>
//               <option value="IT">IT</option>
//               <option value="Textile">Textile</option>
//             </select>
//             <input name="shifts" placeholder="Operating Hours / Shifts" onChange={handleChange} />
//             <input name="monthlyUnits" placeholder="Approx Monthly Units" onChange={handleChange} />
//             <input name="city" placeholder="City / Industrial Area" onChange={handleChange} />
//           </>
//         )}

//         {/* DISCOM / ADMIN FIELDS */}
//         {role === "discom" && (
//           <>
//             <input name="orgName" placeholder="Organization Name" onChange={handleChange} />
//             <input name="designation" placeholder="Designation" onChange={handleChange} />
//             <input name="region" placeholder="Region / City" onChange={handleChange} />
//             <input name="accessCode" placeholder="Admin Access Code" onChange={handleChange} />
//           </>
//         )}

//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;













import { useState } from "react";
import "../styles/auth.css";

function Register({ onFinish }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const finish = () => {
    const userData = { role, ...form };
    localStorage.setItem("user", JSON.stringify(userData));
    onFinish(role);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registration</h2>

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <>
            <h4>Select Role</h4>
            <button onClick={() => { setRole("home"); next(); }}>Home User</button>
            <button onClick={() => { setRole("industry"); next(); }}>Industry User</button>
            <button onClick={() => { setRole("discom"); next(); }}>DISCOM / Admin</button>
          </>
        )}

        {/* STEP 2: COMMON DETAILS */}
        {step === 2 && (
          <>
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}

        {/* STEP 3: ROLE-SPECIFIC DETAILS */}
        {step === 3 && role === "home" && (
          <>
            <input name="city" placeholder="City / Location" onChange={handleChange} />
            <select name="houseType" onChange={handleChange}>
              <option value="">House Type</option>
              <option value="Flat">Flat</option>
              <option value="Independent">Independent</option>
            </select>
            <input name="monthlyUnits" placeholder="Avg Monthly Units (optional)" onChange={handleChange} />
            <select name="provider" onChange={handleChange}>
              <option value="">Electricity Provider</option>
              <option value="Tata">Tata</option>
              <option value="Adani">Adani</option>
              <option value="BEST">BEST</option>
            </select>

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish}>Finish</button>
            </div>
          </>
        )}

        {step === 3 && role === "industry" && (
          <>
            <input name="industryName" placeholder="Industry Name" onChange={handleChange} />
            <select name="industryType" onChange={handleChange}>
              <option value="">Industry Type</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="IT">IT</option>
              <option value="Textile">Textile</option>
            </select>
            <input name="shifts" placeholder="Operating Hours / Shifts" onChange={handleChange} />
            <input name="monthlyUnits" placeholder="Approx Monthly Units" onChange={handleChange} />
            <input name="city" placeholder="City / Industrial Area" onChange={handleChange} />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish}>Finish</button>
            </div>
          </>
        )}

        {step === 3 && role === "discom" && (
          <>
            <input name="orgName" placeholder="Organization Name" onChange={handleChange} />
            <input name="designation" placeholder="Designation" onChange={handleChange} />
            <input name="region" placeholder="Region / City" onChange={handleChange} />
            <input name="accessCode" placeholder="Admin Access Code (optional)" onChange={handleChange} />

            <div className="step-actions">
              <button onClick={back}>Back</button>
              <button onClick={finish}>Finish</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;

