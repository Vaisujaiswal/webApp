import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { FaPlus, FaTrash } from "react-icons/fa";

const API_BASE = "https://webapp-c14r.onrender.com/api";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [power, setPower] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState("");


  const token = localStorage.getItem("token");

  /* =========================
     LOAD DEVICES (BACKEND)
  ========================= */
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setError(null);

        const res = await fetch(`${API_BASE}/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch devices");
        }

        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error("DEVICE FETCH ERROR:", err);
        setError("Unable to load devices");
      }
    };

    if (token) {
      fetchDevices();
    }
  }, [token]);

  /* =========================
     ADD DEVICE
  ========================= */
  const addDevice = async () => {
    if (!name || !power || !hours || !count) return;

    try {
      setLoading(true);
      setError(null);

      const totalPower = Number(power) * Number(count);

      const res = await fetch(`${API_BASE}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          power: totalPower,          // ✅ multiplied power
          hours: Number(hours),       // backend → hoursPerDay
          count: Number(count),       // (optional, future use)
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add device");
      }

      const newDevice = await res.json();
      setDevices((prev) => [newDevice, ...prev]);

      setName("");
      setPower("");
      setHours("");
      setCount("");
    } catch (err) {
      console.error("ADD DEVICE ERROR:", err);
      setError("Unable to add device");
    } finally {
      setLoading(false);
    }
  };





  /* =========================
     REMOVE DEVICE
  ========================= */
  const removeDevice = async (id) => {
    try {
      setError(null);

      const res = await fetch(`${API_BASE}/devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete device");
      }

      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("REMOVE DEVICE ERROR:", err);
      setError("Unable to remove device");
    }
  };

  /* =========================
     DERIVED METRICS (REAL)
  ========================= */
  const totalPower = devices.reduce(
    (sum, d) => sum + (d.power || 0),
    0
  );

  const totalUnits =
    devices.reduce(
      (sum, d) =>
        sum + (d.power || 0) * (d.hoursPerDay || 0),
      0
    ) / 1000;

  return (
    <div style={{ padding: "25px" }}>
      <h2>Device Management</h2>
      <p>Add and manage your electrical devices.</p>

      {error && <p className="error">{error}</p>}

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
            placeholder="No of devices"
            value={count}
            min="1"
            onChange={(e) => setCount(e.target.value)}
          />


          <input
            type="number"
            placeholder="Usage Hours / Day"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <button
            onClick={addDevice}
            className="add-device-btn"
            disabled={loading}
          >
            <FaPlus /> {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* DEVICE LIST */}
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
                <th>No. of Devices</th>
                <th>Hours / Day</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {devices.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.power}</td>
                  <td>{d.count ?? 1}</td>
                  <td>{d.hoursPerDay}</td>
                  <td>
                    <FaTrash
                      style={{ cursor: "pointer", color: "#f87171" }}
                      onClick={() => removeDevice(d._id)}
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
        <p>
          <strong>Total Connected Load:</strong>{" "}
          {totalPower} W
        </p>
        <p>
          <strong>Estimated Daily Usage:</strong>{" "}
          {totalUnits.toFixed(2)} kWh
        </p>
      </div>
    </div>
  );
}

export default Devices;
