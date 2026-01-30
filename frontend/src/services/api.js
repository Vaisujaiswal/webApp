import axios from "axios";

export const getEnergyData = () =>
  axios.get("http://localhost:5000/api/energy/today");
