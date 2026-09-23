// Economic Impact and Operational Savings Model for CVRP
import type { CVRPSolution, EconomicConfig, EconomicMetrics } from './types';

export const DEFAULT_ECONOMIC_CONFIG: EconomicConfig = {
  costPerKm: 1.75, // $1.75 per km (fuel + maintenance + wear)
  fixedVehicleCost: 150.0, // $150 fixed daily deployment cost per vehicle
  driverCostPerRoute: 85.0, // $85 per driver dispatch
  averageRevenuePerDelivery: 28.5, // $28.50 potential revenue per customer delivery slot
};

/**
 * Calculates operational savings and potential revenue opportunity between
 * a baseline (naive Nearest-Neighbor) solution and an optimized HGS solution.
 *
 * Cost reduction and revenue opportunity are strictly distinguished:
 * - Total Operational Savings = direct cost reduction (fuel, vehicle deployment, driver dispatch).
 * - Potential Revenue Opportunity = commercial upside from capacity and fleet hours unlocked by routing efficiency.
 */
export function calculateEconomics(
  baseline: CVRPSolution,
  optimized: CVRPSolution,
  config: Partial<EconomicConfig> = {}
): EconomicMetrics {
  const fullConfig: EconomicConfig = { ...DEFAULT_ECONOMIC_CONFIG, ...config };

  const baselineDistance = Math.max(0, baseline.totalDistance);
  const optimizedDistance = Math.max(0, optimized.totalDistance);

  const savedDistance = Math.max(0, baselineDistance - optimizedDistance);
  const distanceReductionPercent =
    baselineDistance > 0 ? (savedDistance / baselineDistance) * 100 : 0;

  // 1. Fuel & Transport Wear Savings
  const fuelTransportSavings = savedDistance * fullConfig.costPerKm;

  // 2. Fleet Fixed Cost Savings (vehicles removed from active duty)
  const savedVehicles = Math.max(0, baseline.vehiclesUsed - optimized.vehiclesUsed);
  const vehicleCostSavings = savedVehicles * fullConfig.fixedVehicleCost;

  // 3. Driver Dispatch Cost Savings
  const driverCostSavings = savedVehicles * fullConfig.driverCostPerRoute;

  // Total Operational Savings (direct expenditure reduction)
  const totalOperationalSavings =
    fuelTransportSavings + vehicleCostSavings + driverCostSavings;

  // 4. Distinct Potential Revenue Opportunity
  // Efficiency gains free up fleet driving hours and capacity.
  // We model the commercial value of newly available capacity slots for extra high-margin deliveries.
  const totalDeliveries = optimized.routes.reduce((acc, r) => acc + r.customerIds.length, 0);
  const efficiencyRatio = baselineDistance > 0 ? savedDistance / baselineDistance : 0;
  // Estimated additional customer deliveries that could be scheduled with the saved distance/time
  const additionalDeliveries = totalDeliveries * efficiencyRatio * 0.75;
  const potentialRevenueOpportunity = additionalDeliveries * fullConfig.averageRevenuePerDelivery;

  return {
    baselineDistance: Number(baselineDistance.toFixed(2)),
    optimizedDistance: Number(optimizedDistance.toFixed(2)),
    savedDistance: Number(savedDistance.toFixed(2)),
    distanceReductionPercent: Number(distanceReductionPercent.toFixed(1)),
    fuelTransportSavings: Number(fuelTransportSavings.toFixed(2)),
    vehicleCostSavings: Number(vehicleCostSavings.toFixed(2)),
    driverCostSavings: Number(driverCostSavings.toFixed(2)),
    totalOperationalSavings: Number(totalOperationalSavings.toFixed(2)),
    potentialRevenueOpportunity: Number(potentialRevenueOpportunity.toFixed(2)),
  };
}
