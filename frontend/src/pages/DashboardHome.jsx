import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";
import EfficiencyMeter from "../components/EfficiencyMeter";
import "../styles/dashboard.css";
import { FaRupeeSign, FaBolt, FaBullseye } from "react-icons/fa";
import { generateRecommendations } from "../utils/recommendationEngine";

function DashboardHome() {
  const [recommendations, setRecommendations] = useState([]);

  // TEMP: replace later with real API data
  const usageData = {
    nightUsageHigh: true,
    acUsageHigh: true,
    idleDevicesDetected: false,
  };

  useEffect(() => {
    const recs = generateRecommendations(usageData);
    setRecommendations(recs);
  }, []);

  return (
    <>
      <div className="stats">
        <StatCard title="Total Cost" value="₹1450" icon={<FaRupeeSign />} />
        <StatCard title="Usage Today" value="32.5 kWh" icon={<FaBolt />} />
        <StatCard title="Efficiency" value="78%" icon={<FaBullseye />} />
      </div>

      <div className="content">
        <EnergyChart />

        <div className="recommendations">
          <h3>Smart Suggestions</h3>

          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              text={rec.text}
              meta={`Confidence: ${rec.confidence}`}
            />
          ))}
        </div>
      </div>

      <div className="bottom">
        <EfficiencyMeter />
      </div>
    </>
  );
}

export default DashboardHome;
