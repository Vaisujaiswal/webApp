export function generateRecommendations(usageData) {
  const recommendations = [];

  // Safety: no extreme advice
  const SAFE_CONFIDENCE = "Medium";

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

  if (recommendations.length === 0) {
    recommendations.push({
      text: "Your energy usage looks balanced today. Keep following the same habits.",
      confidence: "Low",
      reason: "No abnormal pattern detected",
    });
  }

  return recommendations;
}
