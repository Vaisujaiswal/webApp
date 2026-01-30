// import { useState } from "react";
// import "../styles/dashboard.css";

// function ElectricityCalculator() {
//   const [power, setPower] = useState("");
//   const [hours, setHours] = useState("");
//   const [durationType, setDurationType] = useState("days");
//   const [duration, setDuration] = useState("");
//   const [tariff, setTariff] = useState("");
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const calculate = () => {
//     const powerNum = parseFloat(power);
//     const hoursNum = parseFloat(hours);
//     const durationNum = parseFloat(duration);
//     const tariffNum = parseFloat(tariff);

//     if (
//       isNaN(powerNum) ||
//       isNaN(hoursNum) ||
//       isNaN(durationNum) ||
//       isNaN(tariffNum)
//     ) {
//       setError("Please enter all values correctly");
//       return;
//     }

//     setError("");

//     const days =
//       durationType === "months" ? durationNum * 30 : durationNum;

//     const energy = (powerNum * hoursNum * days) / 1000;
//     const cost = energy * tariffNum;

//     setResult({
//       days,
//       energy: energy.toFixed(2),
//       cost: cost.toFixed(2),
//     });
//   };

//   return (
//     <div className="calculator-card">
//       <h2>Electricity Consumption Calculator</h2>

//       {error && <p className="error">{error}</p>}

//       <label>Appliance Power (Watts)</label>
//       <input
//         type="number"
//         placeholder="e.g. 1500"
//         value={power}
//         onChange={(e) => setPower(e.target.value)}
//       />

//       <label>Usage Hours (per day)</label>
//       <input
//         type="number"
//         placeholder="e.g. 5"
//         value={hours}
//         onChange={(e) => setHours(e.target.value)}
//       />

//       <label>Duration Type</label>
//       <select
//         value={durationType}
//         onChange={(e) => setDurationType(e.target.value)}
//       >
//         <option value="days">Days</option>
//         <option value="months">Months</option>
//       </select>

//       <label>Duration Value</label>
//       <input
//         type="number"
//         placeholder="e.g. 30"
//         value={duration}
//         onChange={(e) => setDuration(e.target.value)}
//       />

//       <label>Tariff (₹ per kWh)</label>
//       <input
//         type="number"
//         placeholder="e.g. 7"
//         value={tariff}
//         onChange={(e) => setTariff(e.target.value)}
//       />

//       <button onClick={calculate}>Calculate</button>

//       {result && (
//         <div className="calculator-result">
//           <p><strong>Total Days:</strong> {result.days}</p>
//           <p><strong>Energy Consumed:</strong> {result.energy} kWh</p>
//           <p><strong>Estimated Cost:</strong> ₹{result.cost}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ElectricityCalculator;



























import { useState } from "react";
import "../styles/calculator.css";

function ElectricityCalculator() {
  const [company, setCompany] = useState("IESCO");
  const [hours, setHours] = useState(5);

  const [appliances, setAppliances] = useState({
    lights: 60,
    fans: 75,
    ac: 1500,
    fridge: 200,
    computer: 300,
    other: 100
  });

  const [result, setResult] = useState(null);

  const tariffMap = {
    IESCO: 7,
    Tata: 8,
    Adani: 9,
    BEST: 6
  };

  const handleChange = (name, value) => {
    setAppliances({ ...appliances, [name]: value });
  };

  const calculate = () => {
    const totalPower =
      appliances.lights +
      appliances.fans +
      appliances.ac +
      appliances.fridge +
      appliances.computer +
      appliances.other;

    const units = (totalPower * hours * 30) / 1000;
    const cost = units * tariffMap[company];
    const gst = cost * 0.17;
    const totalBill = cost + gst;

    setResult({
      units: units.toFixed(2),
      cost: cost.toFixed(2),
      totalBill: totalBill.toFixed(2),
      saved: (units * 0.1).toFixed(2),
      savingPercent: 10
    });
  };

  return (
    <div className="calc-card">
      <h2>Electricity Consumption Calculator</h2>

      <label>Select Your Electricity Distribution Company</label>
      <select value={company} onChange={(e) => setCompany(e.target.value)}>
        <option value="IESCO">IESCO</option>
        <option value="Tata">Tata Power</option>
        <option value="Adani">Adani</option>
        <option value="BEST">BEST</option>
      </select>

      <div className="grid">
        <input
          type="number"
          placeholder="Lights (W)"
          value={appliances.lights}
          onChange={(e) => handleChange("lights", e.target.value)}
        />
        <input
          type="number"
          placeholder="Fans (W)"
          value={appliances.fans}
          onChange={(e) => handleChange("fans", e.target.value)}
        />
        <input
          type="number"
          placeholder="AC (W)"
          value={appliances.ac}
          onChange={(e) => handleChange("ac", e.target.value)}
        />
        <input
          type="number"
          placeholder="Fridge (W)"
          value={appliances.fridge}
          onChange={(e) => handleChange("fridge", e.target.value)}
        />
        <input
          type="number"
          placeholder="Computer (W)"
          value={appliances.computer}
          onChange={(e) => handleChange("computer", e.target.value)}
        />
        <input
          type="number"
          placeholder="Other (W)"
          value={appliances.other}
          onChange={(e) => handleChange("other", e.target.value)}
        />
      </div>

      <label>Average Daily Usage (Hours)</label>
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button onClick={calculate}>Calculate</button>

      {result && (
        <div className="results">
          <h3>Results</h3>
          <p><strong>Total Units Consumed:</strong> {result.units} kWh</p>
          <p><strong>Electricity Cost:</strong> ₹{result.cost}</p>
          <p><strong>Total Bill (Including 17% GST):</strong> ₹{result.totalBill}</p>
          <p><strong>Energy Saved:</strong> {result.saved} kWh</p>
          <p><strong>Savings (%):</strong> {result.savingPercent}%</p>
        </div>
      )}
    </div>
  );
}

export default ElectricityCalculator;
