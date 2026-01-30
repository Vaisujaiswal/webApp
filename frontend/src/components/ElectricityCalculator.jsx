
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
    const numericValue = Math.max(0, Number(value) || 0);
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

  return (
    <div className="calc-card">
      <header className="calc-header">
        <h2>Electricity Consumption Calculator</h2>
        <p className="calc-subtitle">
          Estimate your monthly electricity bill and potential savings
        </p>
      </header>

      {/* Company Selection */}
      <section className="calc-section">
        <label htmlFor="company-select" className="calc-label">
          Electricity Distribution Company
        </label>
        <select
          id="company-select"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="calc-select"
          aria-label="Select electricity company"
        >
          {Object.keys(TARIFF_RATES).map((company) => (
            <option key={company} value={company}>
              {company} - {formatCurrency(TARIFF_RATES[company])}/kWh
            </option>
          ))}
        </select>
      </section>

      {/* Appliance Inputs */}
      <section className="calc-section">
        <h3 className="calc-section-title">Appliance Wattage</h3>
        <div className="grid">
          {Object.keys(APPLIANCE_DEFAULTS).map((appliance) => (
            <div key={appliance} className="input-wrapper">
              <label htmlFor={`appliance-${appliance}`} className="sr-only">
                {APPLIANCE_LABELS[appliance]} Wattage
              </label>
              <input
                id={`appliance-${appliance}`}
                type="number"
                min="0"
                placeholder={`${APPLIANCE_LABELS[appliance]} (W)`}
                value={applianceWattages[appliance]}
                onChange={(e) =>
                  handleApplianceChange(appliance, e.target.value)
                }
                className="calc-input"
                aria-label={`${APPLIANCE_LABELS[appliance]} wattage in watts`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Usage Hours */}
      <section className="calc-section">
        <label htmlFor="usage-hours" className="calc-label">
          Average Daily Usage (Hours)
        </label>
        <input
          id="usage-hours"
          type="number"
          min="0"
          max="24"
          value={dailyUsageHours}
          onChange={(e) => handleHoursChange(e.target.value)}
          className="calc-input"
          aria-label="Average daily usage hours"
        />
        <small className="calc-hint">Maximum 24 hours per day</small>
      </section>

      {/* Calculate Button */}
      <button
        onClick={calculateElectricityCost}
        className="calc-button"
        aria-label="Calculate electricity cost"
      >
        Calculate Bill
      </button>

      {/* Results Display */}
      {calculationResult && (
        <section className="results" role="region" aria-label="Calculation results">
          <h3>Your Monthly Estimate</h3>

          <div className="result-grid">
            <ResultItem
              label="Total Power Consumption"
              value={`${calculationResult.totalPowerWatts.toFixed(0)} W`}
              description="Combined wattage of all appliances"
            />

            <ResultItem
              label="Monthly Units Consumed"
              value={formatUnits(calculationResult.monthlyUnits)}
              description="Total electricity consumption"
              highlight={true}
            />

            <ResultItem
              label="Base Electricity Cost"
              value={formatCurrency(calculationResult.baseCost)}
              description="Cost before taxes"
            />

            <ResultItem
              label="GST (17%)"
              value={formatCurrency(calculationResult.gstAmount)}
              description="Government sales tax"
            />

            <ResultItem
              label="Total Bill"
              value={formatCurrency(calculationResult.totalBill)}
              description="Final payable amount"
              highlight={true}
              important={true}
            />

            <ResultItem
              label="Potential Savings"
              value={formatUnits(calculationResult.potentialSavings)}
              description={`~${calculationResult.savingsPercentage}% reduction with energy-efficient appliances`}
              positive={true}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default ElectricityCalculator;