import { useMemo } from "react";
import "../styles/dashboard.css";

import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";

import {
  FaRupeeSign,
  FaBolt,
  FaBullseye,
} from "react-icons/fa";

import { useEnergyReports } from "../hooks/useEnergyReports";
import { generateRecommendations } from "../utils/recommendationEngine";

function DashboardHome() {
  const {
    loading,
    dailyUnits,
    monthlyUnits,
    monthlyCost,
    deviceUsage,
  } = useEnergyReports();

  /* =====================
     RECOMMENDATIONS (DERIVED)
     still frontend, but REAL data
  ===================== */
  const recommendations = useMemo(() => {
    if (loading) return [];
    return generateRecommendations({
      dailyUnits,
      monthlyUnits,
      deviceUsage,
    });
  }, [loading, dailyUnits, monthlyUnits, deviceUsage]);

  return (
    <div className="dashboard-container">
      {/* =====================
          STATS OVERVIEW
      ===================== */}
      <div className="stats stats-animate">
        <StatCard
          title="Daily Energy Usage"
          value={loading ? "—" : `${dailyUnits.toFixed(2)} kWh`}
          icon={<FaBolt />}
        />

        <StatCard
          title="Monthly Energy Usage"
          value={loading ? "—" : `${monthlyUnits.toFixed(1)} kWh`}
          icon={<FaBullseye />}
        />

        <StatCard
          title="Estimated Monthly Cost"
          value={loading ? "—" : `₹${monthlyCost.toFixed(0)}`}
          icon={<FaRupeeSign />}
        />
      </div>

      {/* =====================
          GRAPH SECTION
      ===================== */}
      <div className="content">
        <div className="chart-section">
          <h3 className="section-title">
            Energy Usage by Device (Daily)
          </h3>

          {loading ? (
            <p style={{ opacity: 0.6 }}>Loading chart…</p>
          ) : (
            <EnergyChart data={deviceUsage} />
          )}
        </div>

        {/* =====================
            RECOMMENDATIONS
        ===================== */}
        <div className="recommendations">
          <h3 className="section-title">💡 Smart Suggestions</h3>

          {loading ? (
            <p style={{ opacity: 0.6 }}>Analyzing usage…</p>
          ) : recommendations.length === 0 ? (
            <p style={{ opacity: 0.6 }}>
              No recommendations available
            </p>
          ) : (
            recommendations.map((rec, i) => (
              <RecommendationCard
                key={i}
                text={rec.text}
                meta={`Confidence: ${rec.confidence}`}
              />
            ))
          )}
        </div>
      </div>

      {/* =====================
          INFO
      ===================== */}
      <div style={{ opacity: 0.7, marginTop: 20 }}>
        👉 Open <b>Reports</b> for detailed charts, trends, and
        cost breakdown.
      </div>
    </div>
  );
}

export default DashboardHome;
