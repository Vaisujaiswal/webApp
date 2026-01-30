
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import StatCard from "../components/StatCard";
// import EnergyChart from "../components/EnergyChart";
// import RecommendationCard from "../components/RecommendationCard";
// import EfficiencyMeter from "../components/EfficiencyMeter";
// import "../styles/dashboard.css";
// import { FaRupeeSign, FaBolt, FaBullseye } from "react-icons/fa";

// function Dashboard({ role }) {
//   return (
//     <div className="app">
//       <Sidebar />

//       <div className="main">
//         <TopBar />

//         <div className="stats">
//           <StatCard title="Total Cost" value="₹1450" icon={<FaRupeeSign />} />
//           <StatCard title="Usage Today" value="32.5 kWh" icon={<FaBolt />} />
//           <StatCard title="Efficiency" value="78%" icon={<FaBullseye />} />
//         </div>

//         <div className="content">
//           <EnergyChart />

//           <div className="recommendations">
//             <h3>Optimization Tips</h3>
//             <RecommendationCard text="Set AC to 24°C after 10 PM → Save ₹100/day" />
//             <RecommendationCard text="Run washing machine after 10 PM" />
//             <RecommendationCard text="Turn off idle devices at night" />
//           </div>
//         </div>

//         <div className="bottom">
//           <EfficiencyMeter />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;






















// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import StatCard from "../components/StatCard";
// import EnergyChart from "../components/EnergyChart";
// import RecommendationCard from "../components/RecommendationCard";
// import EfficiencyMeter from "../components/EfficiencyMeter";
// import "../styles/dashboard.css";
// import { FaRupeeSign, FaBolt, FaBullseye } from "react-icons/fa";

// import { Routes, Route } from "react-router-dom";
// import DashboardHome from "./DashboardHome";
// import UsageCosts from "./UsageCosts";
// import Devices from "./Devices";
// import Reports from "./Reports";
// import Emissions from "./Emissions";

// function Dashboard({ role, onLogout }) {
//   return (
//     <div className="app">
//       <Sidebar onLogout={onLogout} />

//       <div className="main">
//         <TopBar />

//          <Routes>
//           <Route path="/" element={<DashboardHome />} />
//           <Route path="/usage" element={<UsageCosts />} />
//           <Route path="/devices" element={<Devices />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/emissions" element={<Emissions />} />
//         </Routes>

//         <div className="stats">
//           <StatCard title="Total Cost" value="₹1450" icon={<FaRupeeSign />} />
//           <StatCard title="Usage Today" value="32.5 kWh" icon={<FaBolt />} />
//           <StatCard title="Efficiency" value="78%" icon={<FaBullseye />} />
//         </div>

//         <div className="content">
//           <EnergyChart />

//           <div className="recommendations">
//             <h3>Optimization Tips</h3>
//             <RecommendationCard text="Set AC to 24°C after 10 PM → Save ₹100/day" />
//             <RecommendationCard text="Run washing machine after 10 PM" />
//             <RecommendationCard text="Turn off idle devices at night" />
//           </div>
//         </div>

//         <div className="bottom">
//           <EfficiencyMeter />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;










import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "../styles/dashboard.css";

import { Routes, Route } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import UsageCosts from "./UsageCosts";
import Devices from "./Devices";
import Reports from "./Reports";
import Emissions from "./Emissions";

function Dashboard({ role, onLogout }) {
  return (
    <div className="app">
      <Sidebar onLogout={onLogout} />

      <div className="main">
        <TopBar />

        {/* PAGE CONTENT CHANGES HERE */}
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/usage" element={<UsageCosts />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/emissions" element={<Emissions />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
