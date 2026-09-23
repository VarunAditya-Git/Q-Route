// Dynamic Programming Split Algorithm (Prins 2004, Vidal 2022)
// Converts an unpartitioned giant tour (permutation of customer IDs) into an optimal CVRP solution.

import type { CVRPProblem, CVRPSolution, Route } from './types';
import { DistanceMatrix } from './distance';
import { validateSolution } from './validator';

export interface SplitResult {
  routes: Route[];
  totalDistance: number;
  feasible: boolean;
  penalizedCost: number;
}

/**
 * Splits a giant tour (permutation of customer IDs) into vehicle routes
 * using dynamic programming with capacity and fleet excess penalties.
 */
export function splitGiantTour(
  giantTour: number[],
  problem: CVRPProblem,
  distanceMatrix: DistanceMatrix,
  penaltyCapacity: number = 1000,
  penaltyFleet: number = 5000
): CVRPSolution {
  const n = giantTour.length;
  if (n === 0) {
    return {
      id: `sol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      routes: [],
      totalDistance: 0,
      feasible: true,
      vehiclesUsed: 0,
      validation: {
        feasible: true,
        violations: {
          missingCustomers: [],
          duplicateCustomers: [],
          capacityViolations: [],
          fleetViolation: false,
          excessVehicles: 0,
        },
        totalViolationScore: 0,
      },
      penalizedCost: 0,
      giantTour: [],
    };
  }

  // Pre-extract demands for giant tour nodes
  const demandMap = new Map<number, number>();
  for (const c of problem.customers) {
    demandMap.set(c.id, c.demand);
  }

  // V[j] = minimum cost to partition customers giantTour[0 ... j-1]
  const V = new Float64Array(n + 1);
  V.fill(Infinity);
  V[0] = 0;

  const pred = new Int32Array(n + 1);
  pred.fill(-1);

  // Dynamic programming forward pass
  for (let i = 0; i < n; i++) {
    if (V[i] === Infinity) continue;

    let currentLoad = 0;
    let routeDist = 0;

    for (let j = i + 1; j <= n; j++) {
      const custId = giantTour[j - 1];
      const demand = demandMap.get(custId) || 0;
      currentLoad += demand;

      // Update route distance incrementally
      if (j === i + 1) {
        // First customer: Depot (0) -> custId -> Depot (0)
        routeDist = distanceMatrix.get(0, custId) + distanceMatrix.get(custId, 0);
      } else {
        const prevCustId = giantTour[j - 2];
        // Replace (prevCustId -> Depot) with (prevCustId -> custId -> Depot)
        routeDist =
          routeDist -
          distanceMatrix.get(prevCustId, 0) +
          distanceMatrix.get(prevCustId, custId) +
          distanceMatrix.get(custId, 0);
      }

      // Capacity penalty
      const excessLoad = Math.max(0, currentLoad - problem.vehicleCapacity);
      const arcCost = routeDist + penaltyCapacity * excessLoad;

      const totalCost = V[i] + arcCost;
      if (totalCost < V[j]) {
        V[j] = totalCost;
        pred[j] = i;
      }

      // Early break pruning heuristic if load exceeds 2x capacity
      // (avoids exploring nonsensical giant arcs)
      if (currentLoad > problem.vehicleCapacity * 2) {
        break;
      }
    }
  }

  // Backtrack to reconstruct routes
  const routeSegments: number[][] = [];
  let curr = n;
  while (curr > 0) {
    const p = pred[curr];
    if (p === -1) {
      // Fallback in case of disconnected DP: partition remaining into singletons
      routeSegments.push([giantTour[curr - 1]]);
      curr--;
    } else {
      routeSegments.push(giantTour.slice(p, curr));
      curr = p;
    }
  }

  routeSegments.reverse();

  // Build Route objects
  let totalDistance = 0;
  let totalExcessCapacity = 0;
  const routes: Route[] = routeSegments.map((customerIds, idx) => {
    let load = 0;
    for (const c of customerIds) {
      load += demandMap.get(c) || 0;
    }
    const dist = distanceMatrix.calculateRouteDistance(customerIds);
    totalDistance += dist;

    const excess = Math.max(0, load - problem.vehicleCapacity);
    totalExcessCapacity += excess;

    return {
      vehicleId: idx + 1,
      customerIds,
      load,
      distance: dist,
      feasible: load <= problem.vehicleCapacity,
    };
  });

  const vehiclesUsed = routes.length;
  const excessVehicles = Math.max(0, vehiclesUsed - problem.vehicleCount);
  const penalizedCost =
    totalDistance +
    penaltyCapacity * totalExcessCapacity +
    penaltyFleet * excessVehicles;

  const tempSolution = { routes };
  const validation = validateSolution(tempSolution, problem);

  return {
    id: `sol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    routes,
    totalDistance,
    feasible: validation.feasible,
    vehiclesUsed,
    validation,
    penalizedCost,
    giantTour: [...giantTour],
  };
}

/**
 * Extracts a giant tour from an existing CVRPSolution by concatenating all routes
 */
export function extractGiantTour(solution: CVRPSolution): number[] {
  const giant: number[] = [];
  for (const r of solution.routes) {
    for (const id of r.customerIds) {
      giant.push(id);
    }
  }
  return giant;
}
