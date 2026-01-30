// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import StatCard from "../components/StatCard";
// import EnergyChart from "../components/EnergyChart";
// import RecommendationCard from "../components/RecommendationCard";
// import EfficiencyMeter from "../components/EfficiencyMeter";

// function Dashboard() {
//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{ flex: 1 }}>
//         <TopBar />

//         <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//           <StatCard title="Total Cost" value="₹1450" />
//           <StatCard title="Usage Today" value="32.5 kWh" />
//           <StatCard title="Efficiency" value="78%" />
//         </div>

//         <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//           <EnergyChart />

//           <div>
//             <h3>Optimization Tips</h3>
//             <RecommendationCard text="Run AC after 10 PM to save ₹100/day" />
//             <RecommendationCard text="Use washing machine at night" />
//           </div>
//         </div>

//         <div style={{ padding: "20px" }}>
//           <EfficiencyMeter />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;





























import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import RecommendationCard from "../components/RecommendationCard";
import EfficiencyMeter from "../components/EfficiencyMeter";
import "../styles/dashboard.css";
import { FaRupeeSign, FaBolt, FaBullseye } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <TopBar />

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
      </div>
    </div>
  );
}

export default Dashboard;
