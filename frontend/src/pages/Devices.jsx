import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { FaPlus, FaTrash } from "react-icons/fa";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [power, setPower] = useState("");
  const [hours, setHours] = useState("");

  // Load devices from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("devices")) || [];
    setDevices(saved);
  }, []);

  // Save devices to localStorage
  useEffect(() => {
    localStorage.setItem("devices", JSON.stringify(devices));
  }, [devices]);

  const addDevice = () => {
    if (!name || !power || !hours) return;

    setDevices([
      ...devices,
      {
        id: Date.now(),
        name,
        power: Number(power),
        hours: Number(hours)
      }
    ]);

    setName("");
    setPower("");
    setHours("");
  };

  const removeDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const totalPower = devices.reduce((sum, d) => sum + d.power, 0);
  const totalUnits =
    devices.reduce((sum, d) => sum + d.power * d.hours, 0) / 1000;

  return (
    <div style={{ padding: "25px" }}>
      <h2>Device Management</h2>
      <p>Add and manage your electrical devices.</p>

      {/* ADD DEVICE */}
<div className="chart-card">
  <h3>Add Device</h3>

  <div className="add-device-row">
    <input
      placeholder="Device Name (e.g. AC)"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      type="number"
      placeholder="Power (Watts)"
      value={power}
      onChange={(e) => setPower(e.target.value)}
    />

    <input
      type="number"
      placeholder="Usage Hours / Day"
      value={hours}
      onChange={(e) => setHours(e.target.value)}
    />

    <button onClick={addDevice} className="add-device-btn">
      <FaPlus /> Add
    </button>
  </div>
</div>


      {/* DEVICE LIST */}
      <div className="chart-card" style={{ marginTop: "20px" }}>
        <h3>My Devices</h3>

        {devices.length === 0 ? (
          <p>No devices added yet.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Power (W)</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.power}</td>
                  <td>{d.hours}</td>
                  <td>
                    <FaTrash
                      style={{ cursor: "pointer", color: "#f87171" }}
                      onClick={() => removeDevice(d.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SUMMARY */}
      <div className="chart-card" style={{ marginTop: "20px" }}>
        <h3>Summary</h3>
        <p><strong>Total Connected Load:</strong> {totalPower} W</p>
        <p><strong>Daily Energy Usage:</strong> {totalUnits.toFixed(2)} kWh</p>
      </div>
    </div>
  );
}

export default Devices;
