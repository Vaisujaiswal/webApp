import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000/api";
const TARIFF = 7; // ₹ per unit (keep same as Reports)

export function useEnergyReports() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  /* =========================
     FETCH DEVICES (SINGLE SOURCE)
  ========================= */
  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) throw new Error("No auth token");

        const res = await fetch(`${API_BASE}/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch devices");

        const data = await res.json();
        if (isMounted) setDevices(data);
      } catch (err) {
        console.error("useEnergyReports error:", err);
        if (isMounted) {
          setDevices([]);
          setError("Unable to load energy data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDevices();

    return () => {
      isMounted = false;
    };
  }, [token]);

  /* =========================
     DERIVED METRICS
  ========================= */

  // Daily usage per device (kWh)
  const deviceUsage = useMemo(() => {
    return devices.map((d) => ({
      name: d.name,
      usage: Number(((d.power * d.hoursPerDay) / 1000).toFixed(2)),
    }));
  }, [devices]);

  // Total daily units
  const dailyUnits = useMemo(() => {
    return deviceUsage.reduce((sum, d) => sum + d.usage, 0);
  }, [deviceUsage]);

  // Monthly units (simple projection)
  const monthlyUnits = useMemo(() => {
    return dailyUnits * 30;
  }, [dailyUnits]);

  // Monthly cost
  const monthlyCost = useMemo(() => {
    return monthlyUnits * TARIFF;
  }, [monthlyUnits]);

  /* =========================
     EXPOSED API
  ========================= */
  return {
    loading,
    error,

    // raw
    devices,

    // derived
    deviceUsage,
    dailyUnits,
    monthlyUnits,
    monthlyCost,
  };
}
