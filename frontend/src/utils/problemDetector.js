export function detectProblems(energyData) {
  const problems = [];

  if (energyData.nightUnits > energyData.avgUnits * 0.4) {
    problems.push("HIGH_NIGHT_USAGE");
  }

  if (energyData.acUnits > energyData.totalUnits * 0.35) {
    problems.push("AC_DOMINANT_LOAD");
  }

  if (energyData.idleLoad > 0.15) {
    problems.push("IDLE_POWER_DRAIN");
  }

  if (energyData.efficiencyScore < 60) {
    problems.push("LOW_EFFICIENCY_TREND");
  }

  return problems;
}
