import "../styles/dashboard.css";

function RecommendationCard({ text }) {
  return <div className="tip">{text}</div>;
}


const styles = {
  card: {
    background: "#022c22",
    color: "#22c55e",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px"
  }
};

export default RecommendationCard;
