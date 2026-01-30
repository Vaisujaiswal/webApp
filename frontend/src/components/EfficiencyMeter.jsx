import "../styles/dashboard.css";

function EfficiencyMeter() {
  return (
    <div className="efficiency">
      <h2>78%</h2>
      <p>Efficiency Score</p>
    </div>
  );
}


const styles = {
  meter: {
    background: "#1e293b",
    color: "#22c55e",
    padding: "20px",
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    textAlign: "center"
  }
};

export default EfficiencyMeter;
