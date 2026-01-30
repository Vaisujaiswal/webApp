import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";
import "../styles/dashboard.css";

import {
  FaRupeeSign,
  FaBolt,
  FaBullseye,
} from "react-icons/fa";

import { generateRecommendations } from "../utils/recommendationEngine";

function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token missing");
        }

        const res = await fetch(
          "http://localhost:5000/api/energy/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await res.json();

        if (!isMounted) return;

        setSummary(data);

        // Generate recommendations using backend signals
        const recs = generateRecommendations(data.usageSignals || {});
        setRecommendations(recs);

        setAnimateStats(true);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (isMounted) {
          setError("Unable to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* =====================
          STATS
      ===================== */}
      <div className={`stats ${animateStats ? "stats-animate" : ""}`}>
        <StatCard
          title="Total Cost"
          value={summary ? `₹${summary.totalCost}` : "—"}
          icon={<FaRupeeSign />}
        />
        <StatCard
          title="Usage Today"
          value={summary ? `${summary.usageToday} kWh` : "—"}
          icon={<FaBolt />}
        />
        <StatCard
          title="Efficiency"
          value={summary ? `${summary.efficiency}%` : "—"}
          icon={<FaBullseye />}
        />
      </div>

      {/* =====================
          MAIN GRID
      ===================== */}
      <div className="content">
        <div className="chart-section">
          <h3 className="section-title">Energy Usage Pattern</h3>
          <EnergyChart />
        </div>

        <div className="recommendations">
          <h3 className="section-title">💡 Smart Suggestions</h3>
          {recommendations.length === 0 && !isLoading && (
            <p style={{ opacity: 0.7 }}>No suggestions available</p>
          )}
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={i}
              text={rec.text}
              meta={`Confidence: ${rec.confidence}`}
            />
          ))}
        </div>
      </div>

      {/* =====================
          LOADING OVERLAY
      ===================== */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
