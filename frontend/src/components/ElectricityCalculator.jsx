
import { useState, useCallback, useMemo } from "react";
import "../styles/calculator.css";

// Constants
const TARIFF_RATES = {
  IESCO: 7,
  "Tata Power": 8,
  Adani: 9,
  BEST: 6,
};

const GST_RATE = 0.17;
const DAYS_PER_MONTH = 30;
const WATTS_TO_KW = 1000;
const EFFICIENCY_SAVINGS_RATE = 0.1;

const APPLIANCE_DEFAULTS = {
  lights: 60,
  fans: 75,
  ac: 1500,
  fridge: 200,
  computer: 300,
  other: 100,
};

const APPLIANCE_LABELS = {
  lights: "Lights",
  fans: "Fans",
  ac: "Air Conditioner",
  fridge: "Refrigerator",
  computer: "Computer",
  other: "Other Appliances",
};

/**
 * ResultItem Component
 * Displays individual calculation result with styling options
 */
function ResultItem({ label, value, description, highlight, important, positive }) {
  const classNames = [
    "result-item",
    highlight && "result-item--highlight",
    important && "result-item--important",
    positive && "result-item--positive",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      <p className="result-label">{label}</p>
      <p className="result-value">{value}</p>
      <small className="result-description">{description}</small>
    </div>
  );
}

/**
 * ElectricityCalculator Component
 * Calculates monthly electricity consumption and cost based on appliance usage
 */
function ElectricityCalculator() {
  // State Management
  const [selectedCompany, setSelectedCompany] = useState("IESCO");
  const [dailyUsageHours, setDailyUsageHours] = useState(5);
  const [applianceWattages, setApplianceWattages] = useState(APPLIANCE_DEFAULTS);
  const [calculationResult, setCalculationResult] = useState(null);

  // Memoized tariff rate
  const currentTariffRate = useMemo(
    () => TARIFF_RATES[selectedCompany],
    [selectedCompany]
  );

  /**
   * Updates individual appliance wattage
   */
const handleApplianceChange = useCallback((appliance, value) => {
  // ✅ allow empty input while typing
  if (value === "") {
    setApplianceWattages((prev) => ({
      ...prev,
      [appliance]: "",
    }));
    return;
  }

  const numericValue = Math.max(0, Number(value));
  setApplianceWattages((prev) => ({
    ...prev,
    [appliance]: numericValue,
  }));
}, []);


  /**
   * Updates daily usage hours with validation
   */
  const handleHoursChange = useCallback((value) => {
    const numericValue = Math.min(24, Math.max(0, Number(value) || 0));
    setDailyUsageHours(numericValue);
  }, []);

  /**
   * Performs electricity cost calculation
   */
  const calculateElectricityCost = useCallback(() => {
    // Calculate total power consumption
    const totalPowerWatts = Object.values(applianceWattages).reduce(
      (sum, wattage) => sum + wattage,
      0
    );

    // Calculate monthly units (kWh)
    const monthlyUnits =
      (totalPowerWatts * dailyUsageHours * DAYS_PER_MONTH) / WATTS_TO_KW;

    // Calculate costs
    const baseCost = monthlyUnits * currentTariffRate;
    const gstAmount = baseCost * GST_RATE;
    const totalBill = baseCost + gstAmount;

    // Calculate potential savings
    const potentialSavings = monthlyUnits * EFFICIENCY_SAVINGS_RATE;
    const savingsPercentage = EFFICIENCY_SAVINGS_RATE * 100;

    setCalculationResult({
      totalPowerWatts,
      monthlyUnits,
      baseCost,
      gstAmount,
      totalBill,
      potentialSavings,
      savingsPercentage,
    });
  }, [applianceWattages, dailyUsageHours, currentTariffRate]);

  /**
   * Formats currency values
   */
  const formatCurrency = (value) => {
    return `₹${value.toFixed(2)}`;
  };

  /**
   * Formats energy units
   */
  const formatUnits = (value) => {
    return `${value.toFixed(2)} kWh`;
  };


  const getUsageAdvice = () => {
    if (!calculationResult) return null;

    const { monthlyUnits, totalBill } = calculationResult;
    const acWatts = applianceWattages.ac || 0;

    if (monthlyUnits > 400) {
      return {
        level: "high",
        title: "⚠️ High Electricity Usage",
        tips: [
          "Reduce Air Conditioner usage or set it to 24–26°C",
          "Limit daily usage hours where possible",
          "Replace old appliances with energy-efficient models",
          "Avoid running multiple high-power appliances together",
        ],
      };
    }

    if (monthlyUnits > 200) {
      return {
        level: "medium",
        title: "⚡ Moderate Usage",
        tips: [
          "You’re doing okay, but there’s room for savings",
          "Use AC and heavy appliances only when necessary",
          "Switch to LED lights and energy-efficient fans",
          "Turn off appliances instead of keeping them on standby",
        ],
      };
    }

    return {
      level: "low",
      title: "✅ Efficient Energy Usage",
      tips: [
        "Great job! Your electricity usage is efficient",
        "Maintain appliances regularly for best performance",
        "Continue using energy-saving habits",
        "Consider solar or inverter solutions for extra savings",
      ],
    };
  };


  return (

    <div className="calc-page">
      {/* LEFT CONTAINER */}
      <div className="calc-card">
        <header className="calc-header">
          <h2>Electricity Consumption Calculator</h2>
          <p className="calc-subtitle">
            Estimate your monthly electricity bill
          </p>
        </header>

        {/* Company */}
        <section className="calc-section">
          <label className="calc-label">Electricity Provider</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="calc-select"
          >
            {Object.keys(TARIFF_RATES).map((company) => (
              <option key={company} value={company}>
                {company} – ₹{TARIFF_RATES[company]}/kWh
              </option>
            ))}
          </select>
        </section>

        {/* Appliances */}
        <section className="calc-section">
          <h3 className="calc-section-title">Appliance Wattage</h3>

          <div className="grid">
            {Object.keys(APPLIANCE_DEFAULTS).map((appliance) => (
              <div key={appliance} className="input-wrapper">
                <label className="input-label">
                  {APPLIANCE_LABELS[appliance]} (W)
                </label>

                <input
                  type="number"
                  value={applianceWattages[appliance]}
                  onChange={(e) =>
                    handleApplianceChange(appliance, e.target.value)
                  }
                  className="calc-input"
                />
              </div>
            ))}
          </div>
        </section>


        {/* Hours */}
        <section className="calc-section">
          <label className="calc-label">Daily Usage (Hours)</label>
          <input
            type="number"
            value={dailyUsageHours}
            onChange={(e) => handleHoursChange(e.target.value)}
            className="calc-input"
          />
        </section>

        <button onClick={calculateElectricityCost} className="calc-button">
          Calculate Bill
        </button>
      </div>

      {/* RIGHT CONTAINER */}
      <div className="estimate-card">
        {calculationResult ? (
          <>
            <h3>Your Monthly Estimate</h3>

            <div className="estimate-grid">
              <ResultItem
                label="Monthly Units"
                value={formatUnits(calculationResult.monthlyUnits)}
                description="Electricity consumed"
                highlight
              />

              <ResultItem
                label="Base Cost"
                value={formatCurrency(calculationResult.baseCost)}
                description="Before GST"
              />

              <ResultItem
                label="GST"
                value={formatCurrency(calculationResult.gstAmount)}
                description="17% tax"
              />

              <ResultItem
                label="Total Bill"
                value={formatCurrency(calculationResult.totalBill)}
                description="Final payable"
                important
                highlight
              />

              <ResultItem
                label="Potential Savings"
                value={formatUnits(calculationResult.potentialSavings)}
                description="With efficiency tips"
                positive
              />
            </div>
          </>
        ) : (
          <div className="estimate-placeholder">
            <p>📊 Your estimate will appear here</p>
          </div>
        )}

        {calculationResult && (() => {
          const advice = getUsageAdvice();

          return (
            <div className={`advice-card advice-${advice.level}`}>
              <h4>{advice.title}</h4>

              <ul>
                {advice.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          );
        })()}

      </div>
    </div>

  );
}

export default ElectricityCalculator;