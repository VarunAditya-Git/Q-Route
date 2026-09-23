// Local Search Improvement Heuristics for HGS-CVRP
// Neighborhoods:
// 1. 2-Opt (Intra-route edge reversal)
// 2. Relocate (1-0 customer transfer inter/intra route)
// 3. Swap (1-1 customer exchange inter/intra route)

import type { CVRPProblem, CVRPSolution, Route } from './types';
import { DistanceMatrix } from './distance';
import { validateSolution } from './validator';
import { extractGiantTour } from './split';

export interface LocalSearchOptions {
  enableTwoOpt?: boolean;
  enableRelocate?: boolean;
  enableSwap?: boolean;
  maxIterations?: number;
  penaltyCapacity?: number;
  penaltyFleet?: number;
}

/**
 * Executes Variable Neighborhood Descent (VND) on a CVRP solution.
 */
export function applyLocalSearch(
  solution: CVRPSolution,
  problem: CVRPProblem,
  distanceMatrix: DistanceMatrix,
  options: LocalSearchOptions = {}
): CVRPSolution {
  const {
    enableTwoOpt = true,
    enableRelocate = true,
    enableSwap = true,
    maxIterations = 50,
    penaltyCapacity = 1000,
    penaltyFleet = 5000,
  } = options;

  const demandMap = new Map<number, number>();
  for (const c of problem.customers) {
    demandMap.set(c.id, c.demand);
  }

  // Work on a deep copy of route customer IDs
  let currentRoutes: number[][] = solution.routes
    .map(r => [...r.customerIds])
    .filter(r => r.length > 0);

  let improved = true;
  let iteration = 0;

  function calculateRouteCost(route: number[]): { distance: number; load: number; penalizedCost: number } {
    if (route.length === 0) return { distance: 0, load: 0, penalizedCost: 0 };
    const dist = distanceMatrix.calculateRouteDistance(route);
    let load = 0;
    for (const id of route) {
      load += demandMap.get(id) || 0;
    }
    const excess = Math.max(0, load - problem.vehicleCapacity);
    return {
      distance: dist,
      load,
      penalizedCost: dist + penaltyCapacity * excess,
    };
  }

  while (improved && iteration < maxIterations) {
    improved = false;
    iteration++;

    // 1. Relocate (1-0 inter-route and intra-route moves)
    if (enableRelocate) {
      relocateLoop: for (let r1 = 0; r1 < currentRoutes.length; r1++) {
        const route1 = currentRoutes[r1];
        if (route1.length === 0) continue;

        for (let i = 0; i < route1.length; i++) {
          const cust = route1[i];

          // Try moving cust to another route r2
          for (let r2 = 0; r2 < currentRoutes.length; r2++) {
            const route2 = currentRoutes[r2];

            if (r1 === r2) {
              // Intra-route relocate
              for (let j = 0; j <= route1.length; j++) {
                if (j === i || j === i + 1) continue;

                const newRoute1 = [...route1];
                newRoute1.splice(i, 1);
                const targetIdx = j > i ? j - 1 : j;
                newRoute1.splice(targetIdx, 0, cust);

                const cOld = calculateRouteCost(route1).penalizedCost;
                const cNew = calculateRouteCost(newRoute1).penalizedCost;

                if (cNew < cOld - 1e-6) {
                  currentRoutes[r1] = newRoute1;
                  improved = true;
                  break relocateLoop;
                }
              }
            } else {
              // Inter-route relocate
              // Pre-check capacity of r2 to avoid pointless moves
              const custDemand = demandMap.get(cust) || 0;
              const r2CurrentLoad = route2.reduce((acc, c) => acc + (demandMap.get(c) || 0), 0);
              if (r2CurrentLoad + custDemand > problem.vehicleCapacity * 1.5) {
                continue;
              }

              for (let j = 0; j <= route2.length; j++) {
                const newRoute1 = [...route1];
                newRoute1.splice(i, 1);

                const newRoute2 = [...route2];
                newRoute2.splice(j, 0, cust);

                const costBefore =
                  calculateRouteCost(route1).penalizedCost +
                  calculateRouteCost(route2).penalizedCost;
                const costAfter =
                  calculateRouteCost(newRoute1).penalizedCost +
                  calculateRouteCost(newRoute2).penalizedCost;

                // Also check if r1 became empty (reducing fleet count)
                const fleetDelta = (newRoute1.length === 0 ? -1 : 0) * penaltyFleet;

                if (costAfter + fleetDelta < costBefore - 1e-6) {
                  currentRoutes[r1] = newRoute1;
                  currentRoutes[r2] = newRoute2;
                  currentRoutes = currentRoutes.filter(r => r.length > 0);
                  improved = true;
                  break relocateLoop;
                }
              }
            }
          }
        }
      }

      if (improved) continue;
    }

    // 2. Swap (1-1 inter-route and intra-route exchanges)
    if (enableSwap) {
      swapLoop: for (let r1 = 0; r1 < currentRoutes.length; r1++) {
        const route1 = currentRoutes[r1];

        for (let r2 = r1; r2 < currentRoutes.length; r2++) {
          const route2 = currentRoutes[r2];

          for (let i = 0; i < route1.length; i++) {
            const jStart = r1 === r2 ? i + 1 : 0;
            for (let j = jStart; j < route2.length; j++) {
              if (r1 === r2) {
                // Intra-route swap
                const newRoute1 = [...route1];
                const tmp = newRoute1[i];
                newRoute1[i] = newRoute1[j];
                newRoute1[j] = tmp;

                const cOld = calculateRouteCost(route1).penalizedCost;
                const cNew = calculateRouteCost(newRoute1).penalizedCost;

                if (cNew < cOld - 1e-6) {
                  currentRoutes[r1] = newRoute1;
                  improved = true;
                  break swapLoop;
                }
              } else {
                // Inter-route swap
                const newRoute1 = [...route1];
                const newRoute2 = [...route2];
                const tmp = newRoute1[i];
                newRoute1[i] = newRoute2[j];
                newRoute2[j] = tmp;

                const costBefore =
                  calculateRouteCost(route1).penalizedCost +
                  calculateRouteCost(route2).penalizedCost;
                const costAfter =
                  calculateRouteCost(newRoute1).penalizedCost +
                  calculateRouteCost(newRoute2).penalizedCost;

                if (costAfter < costBefore - 1e-6) {
                  currentRoutes[r1] = newRoute1;
                  currentRoutes[r2] = newRoute2;
                  improved = true;
                  break swapLoop;
                }
              }
            }
          }
        }
      }

      if (improved) continue;
    }

    // 3. 2-Opt (Intra-route edge reversal)
    if (enableTwoOpt) {
      twoOptLoop: for (let r = 0; r < currentRoutes.length; r++) {
        const route = currentRoutes[r];
        const m = route.length;
        if (m < 3) continue;

        for (let i = 0; i < m - 1; i++) {
          for (let j = i + 1; j < m; j++) {
            // Reversing segment route[i..j]
            const prev = i === 0 ? 0 : route[i - 1];
            const curr = route[i];
            const next = route[j];
            const after = j === m - 1 ? 0 : route[j + 1];

            // Change in distance: replace (prev->curr) + (next->after) with (prev->next) + (curr->after)
            const oldEdges = distanceMatrix.get(prev, curr) + distanceMatrix.get(next, after);
            const newEdges = distanceMatrix.get(prev, next) + distanceMatrix.get(curr, after);
            const delta = newEdges - oldEdges;

            if (delta < -1e-6) {
              const reversedSegment = route.slice(i, j + 1).reverse();
              const newRoute = [...route.slice(0, i), ...reversedSegment, ...route.slice(j + 1)];
              currentRoutes[r] = newRoute;
              improved = true;
              break twoOptLoop;
            }
          }
        }
      }

      if (improved) continue;
    }
  }

  // Filter out any empty routes and reconstruct the solution object
  const finalCleanRoutes = currentRoutes.filter(r => r.length > 0);
  let totalDist = 0;
  const routes: Route[] = finalCleanRoutes.map((customerIds, idx) => {
    let load = 0;
    for (const c of customerIds) {
      load += demandMap.get(c) || 0;
    }
    const dist = distanceMatrix.calculateRouteDistance(customerIds);
    totalDist += dist;
    return {
      vehicleId: idx + 1,
      customerIds,
      load,
      distance: dist,
      feasible: load <= problem.vehicleCapacity,
    };
  });

  const validation = validateSolution({ routes }, problem);
  const vehiclesUsed = routes.length;
  const excessVehicles = Math.max(0, vehiclesUsed - problem.vehicleCount);
  let excessLoad = 0;
  for (const r of routes) {
    excessLoad += Math.max(0, r.load - problem.vehicleCapacity);
  }

  const penalizedCost =
    totalDist + penaltyCapacity * excessLoad + penaltyFleet * excessVehicles;

  const finalSolution: CVRPSolution = {
    id: solution.id,
    routes,
    totalDistance: totalDist,
    feasible: validation.feasible,
    vehiclesUsed,
    validation,
    penalizedCost,
    giantTour: [],
  };

  finalSolution.giantTour = extractGiantTour(finalSolution);
  return finalSolution;
}
