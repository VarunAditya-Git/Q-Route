// Strict Feasibility Validator for Capacitated Vehicle Routing Problem (CVRP)
import type { CVRPProblem, Route, ValidationResult } from './types';

/**
 * Validates a CVRP solution against all problem constraints:
 * 1. Customer coverage: Every customer visited exactly once (no missing, no duplicates).
 * 2. Capacity: Total load on each route must not exceed vehicle capacity Q.
 * 3. Fleet size: Total number of active routes must not exceed vehicleCount K.
 * 4. All customer visits must be valid customer IDs (1 to N).
 */
export function validateSolution(solution: { routes: Route[] }, problem: CVRPProblem): ValidationResult {
  const visitCounts = new Map<number, number>();
  
  // Initialize visit count for each customer 1..N
  for (const c of problem.customers) {
    visitCounts.set(c.id, 0);
  }

  // Build quick customer demand lookup
  const demandMap = new Map<number, number>();
  for (const c of problem.customers) {
    demandMap.set(c.id, c.demand);
  }

  const missingCustomers: number[] = [];
  const duplicateCustomers: number[] = [];
  const capacityViolations: { routeIndex: number; load: number; capacity: number }[] = [];

  let activeRouteCount = 0;

  for (let rIdx = 0; rIdx < solution.routes.length; rIdx++) {
    const route = solution.routes[rIdx];
    if (!route.customerIds || route.customerIds.length === 0) {
      continue;
    }
    activeRouteCount++;

    let actualRouteLoad = 0;
    for (const custId of route.customerIds) {
      const currentCount = visitCounts.get(custId);
      if (currentCount === undefined) {
        // Unknown customer ID
        duplicateCustomers.push(custId);
      } else {
        visitCounts.set(custId, currentCount + 1);
      }

      const demand = demandMap.get(custId) || 0;
      actualRouteLoad += demand;
    }

    if (actualRouteLoad > problem.vehicleCapacity) {
      capacityViolations.push({
        routeIndex: rIdx,
        load: actualRouteLoad,
        capacity: problem.vehicleCapacity,
      });
    }
  }

  // Check for missing or duplicate customers
  for (const [custId, count] of visitCounts.entries()) {
    if (count === 0) {
      missingCustomers.push(custId);
    } else if (count > 1) {
      duplicateCustomers.push(custId);
    }
  }

  const excessVehicles = Math.max(0, activeRouteCount - problem.vehicleCount);
  const fleetViolation = excessVehicles > 0;

  const isFeasible =
    missingCustomers.length === 0 &&
    duplicateCustomers.length === 0 &&
    capacityViolations.length === 0 &&
    !fleetViolation;

  // Compute a penalty score for violations (0 if fully feasible)
  let totalViolationScore = 0;
  totalViolationScore += missingCustomers.length * 10000;
  totalViolationScore += duplicateCustomers.length * 10000;
  for (const cv of capacityViolations) {
    totalViolationScore += (cv.load - cv.capacity) * 100;
  }
  totalViolationScore += excessVehicles * 5000;

  return {
    feasible: isFeasible,
    violations: {
      missingCustomers,
      duplicateCustomers,
      capacityViolations,
      fleetViolation,
      excessVehicles,
    },
    totalViolationScore,
  };
}

/**
 * Validates a single route for capacity
 */
export function validateRoute(customerIds: number[], problem: CVRPProblem): { feasible: boolean; load: number } {
  let load = 0;
  const demandMap = new Map<number, number>();
  for (const c of problem.customers) {
    demandMap.set(c.id, c.demand);
  }

  for (const id of customerIds) {
    load += demandMap.get(id) || 0;
  }

  return {
    feasible: load <= problem.vehicleCapacity,
    load,
  };
}
