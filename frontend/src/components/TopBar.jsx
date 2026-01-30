import "../styles/dashboard.css";

function TopBar() {
  return (
    <div className="topbar">
      <input placeholder="Search..." />
      <span>👤 User</span>
    </div>
  );
}

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#1e293b",
    color: "#fff"
  },
  search: {
    padding: "8px",
    width: "200px"
  }
};

export default TopBar;
