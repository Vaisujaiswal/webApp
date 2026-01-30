export function generateRecommendations(usageData = {}) {
  const recommendations = [];

  // Safety: no extreme advice
  const SAFE_CONFIDENCE = "Medium";

  /* =========================
     SIGNAL-BASED RECOMMENDATIONS
  ========================= */

  if (usageData.nightUsageHigh) {
    recommendations.push({
      text: "High electricity usage detected after 10 PM. Consider scheduling heavy appliances earlier to reduce peak charges.",
      confidence: SAFE_CONFIDENCE,
      reason: "Night usage above your average",
    });
  }

  if (usageData.acUsageHigh) {
    recommendations.push({
      text: "Air conditioner usage is higher than usual. Setting the temperature to 24–26°C can reduce power consumption.",
      confidence: SAFE_CONFIDENCE,
      reason: "AC accounts for a large share of usage",
    });
  }

  if (usageData.idleDevicesDetected) {
    recommendations.push({
      text: "Some devices appear to consume power while idle. Turning them off at the switch may reduce unnecessary usage.",
      confidence: SAFE_CONFIDENCE,
      reason: "Idle load detected",
    });
  }

  /* =========================
     FALLBACK INTELLIGENCE
     (ENSURE 3 SUGGESTIONS)
  ========================= */

  if (recommendations.length < 3) {
    recommendations.push({
      text: "Monitoring daily usage patterns can help identify appliances that consume more energy than expected.",
      confidence: "Low",
      reason: "General efficiency insight",
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      text: "Using energy-efficient appliances can significantly reduce long-term electricity costs.",
      confidence: "Low",
      reason: "Efficiency best practice",
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      text: "Running heavy appliances during off-peak hours may help lower your overall energy bill.",
      confidence: "Low",
      reason: "Load distribution suggestion",
    });
  }

  /* =========================
     FINAL OUTPUT
  ========================= */

  // Always return max 3 suggestions
  return recommendations.slice(0, 3);
}
