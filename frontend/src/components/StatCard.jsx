import "../styles/dashboard.css";

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <h2>{value}</h2>
    </div>
  );
}

export default StatCard;
