import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";
import EfficiencyMeter from "../components/EfficiencyMeter";
import "../styles/dashboard.css";

import {
  FaRupeeSign,
  FaBolt,
  FaBullseye,
  FaLeaf,
} from "react-icons/fa";

import { generateRecommendations } from "../utils/recommendationEngine";

function DashboardHome() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  // TEMP (later from backend)
  const usageData = {
    nightUsageHigh: true,
    acUsageHigh: true,
    idleDevicesDetected: false,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateStats(true);
    }, 300);

    setRecommendations(generateRecommendations(usageData));
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        {/* <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">⚡</span>
            Energy Overview
          </h1>
          <div className="header-badge">
            <FaLeaf className="leaf-icon" />
            <span>Eco Mode Active</span>
          </div>
        </div> */}
      </div>

      {/* STATS */}
      <div className={`stats ${animateStats ? "stats-animate" : ""}`}>
        <StatCard
          title="Total Cost"
          value="₹1450"
          icon={<FaRupeeSign />}
        />
        <StatCard
          title="Usage Today"
          value="32.5 kWh"
          icon={<FaBolt />}
        />
        <StatCard
          title="Efficiency"
          value="78%"
          icon={<FaBullseye />}
        />
      </div>

      {/* MAIN GRID */}
      <div className="content">
        <div className="chart-section">
          <h3 className="section-title">Energy Usage Pattern</h3>
          <EnergyChart />
        </div>

        <div className="recommendations">
          <h3 className="section-title">💡 Smart Suggestions</h3>
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={i}
              text={rec.text}
              meta={`Confidence: ${rec.confidence}`}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="bottom">
        <EfficiencyMeter />
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
