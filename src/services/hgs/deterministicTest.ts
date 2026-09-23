// Deterministic Test Runner for HGS-CVRP (Section 33 Verification Instance)
import type { CVRPProblem, HGSConfig } from './types';
import { Mulberry32 } from './random';
import { runHGSSync } from './hgsEngine';
import { validateSolution } from './validator';

/**
 * Creates the deterministic Section 33 CVRP benchmark instance:
 * 10 customers, 3 vehicles, capacity 40, generated deterministically from seed 42.
 */
export function createSection33Problem(seed: number = 42): CVRPProblem {
  const rng = new Mulberry32(seed);

  const depot = { x: 50, y: 50, label: 'Central Distribution Depot' };
  const customers = [];

  for (let i = 1; i <= 10; i++) {
    // Generate deterministic coordinates in [10, 90]
    const x = Math.round(10 + rng.nextFloat() * 80);
    const y = Math.round(10 + rng.nextFloat() * 80);
    // Demands between 6 and 14 so total demand is well-proportioned for 3 vehicles of capacity 40
    const demand = Math.round(6 + rng.nextFloat() * 8);

    customers.push({
      id: i,
      x,
      y,
      demand,
      label: `Node #${i}`,
    });
  }

  return {
    depot,
    customers,
    vehicleCount: 3,
    vehicleCapacity: 40,
  };
}

export interface Section33TestReport {
  passed: boolean;
  determinismPassed: boolean;
  feasibilityPassed: boolean;
  monotonicityPassed: boolean;
  customerCoveragePassed: boolean;
  capacityPassed: boolean;
  fleetPassed: boolean;
  run1Distance: number;
  run2Distance: number;
  baselineDistance: number;
  improvementPercent: number;
  vehiclesUsed: number;
  executionTimeMs: number;
  totalGenerations: number;
  summary: string;
}

/**
 * Runs the deterministic verification test suite:
 * 1. Runs HGS with Seed 42 for 100 generations
 * 2. Runs second execution with Seed 42 and verifies bitwise distance determinism
 * 3. Verifies strict customer coverage, capacity limit <= 40, fleet size <= 3
 * 4. Verifies monotonic non-increasing best feasible convergence curve
 */
export function runSection33DeterministicTest(): Section33TestReport {
  const problem = createSection33Problem(42);

  const config: Partial<HGSConfig> = {
    seed: 42,
    populationSize: 50,
    maxGenerations: 100,
    timeLimitMs: 20000,
    localSearchEnabled: true,
  };

  // Run 1
  const result1 = runHGSSync(problem, config);

  // Run 2 (to verify exact determinism)
  const result2 = runHGSSync(problem, config);

  // Check 1: Determinism
  const determinismPassed = Math.abs(result1.bestSolution.totalDistance - result2.bestSolution.totalDistance) < 1e-9;

  // Check 2: Validation
  const val = validateSolution(result1.bestSolution, problem);
  const feasibilityPassed = val.feasible;
  const customerCoveragePassed =
    val.violations.missingCustomers.length === 0 &&
    val.violations.duplicateCustomers.length === 0;
  const capacityPassed = val.violations.capacityViolations.length === 0;
  const fleetPassed = !val.violations.fleetViolation && result1.bestSolution.vehiclesUsed <= problem.vehicleCount;

  // Check 3: Monotonicity of best distance in convergence history
  let monotonicityPassed = true;
  for (let i = 1; i < result1.convergenceHistory.length; i++) {
    if (result1.convergenceHistory[i].bestDistance > result1.convergenceHistory[i - 1].bestDistance + 1e-4) {
      monotonicityPassed = false;
      break;
    }
  }

  const baselineDist = result1.baselineSolution.totalDistance;
  const bestDist = result1.bestSolution.totalDistance;
  const improvementPercent = baselineDist > 0 ? ((baselineDist - bestDist) / baselineDist) * 100 : 0;

  const passed =
    determinismPassed &&
    feasibilityPassed &&
    monotonicityPassed &&
    customerCoveragePassed &&
    capacityPassed &&
    fleetPassed;

  const summary = passed
    ? `Section 33 Verification PASSED: Baseline=${baselineDist.toFixed(1)}, HGS=${bestDist.toFixed(1)} (-${improvementPercent.toFixed(1)}%), Vehicles=${result1.bestSolution.vehiclesUsed}/${problem.vehicleCount}, Feasible=true, Deterministic=true, Monotonic=true.`
    : `Section 33 Verification FAILED: Determinism=${determinismPassed}, Feasible=${feasibilityPassed}, Monotonic=${monotonicityPassed}, Fleet=${fleetPassed}`;

  return {
    passed,
    determinismPassed,
    feasibilityPassed,
    monotonicityPassed,
    customerCoveragePassed,
    capacityPassed,
    fleetPassed,
    run1Distance: result1.bestSolution.totalDistance,
    run2Distance: result2.bestSolution.totalDistance,
    baselineDistance: baselineDist,
    improvementPercent,
    vehiclesUsed: result1.bestSolution.vehiclesUsed,
    executionTimeMs: result1.executionTimeMs,
    totalGenerations: result1.totalGenerations,
    summary,
  };
}
