import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";
import EfficiencyMeter from "../components/EfficiencyMeter";
import "../styles/dashboard.css";
import { FaRupeeSign, FaBolt, FaBullseye } from "react-icons/fa";

function DashboardHome() {
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
          <h3>Optimization Tips</h3>
          <RecommendationCard text="Set AC to 24°C after 10 PM → Save ₹100/day" />
          <RecommendationCard text="Run washing machine after 10 PM" />
          <RecommendationCard text="Turn off idle devices at night" />
        </div>
      </div>

      <div className="bottom">
        <EfficiencyMeter />
      </div>
    </>
  );
}

export default DashboardHome;
