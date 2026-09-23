// Initial Population Generator and Heuristic Baselines for HGS-CVRP
import type { CVRPProblem, CVRPSolution, Route } from './types';
import { DistanceMatrix } from './distance';
import { Mulberry32 } from './random';
import { splitGiantTour, extractGiantTour } from './split';
import { applyLocalSearch } from './localSearch';
import { validateSolution } from './validator';

/**
 * Generates a classic Nearest-Neighbor baseline solution with capacity constraints.
 * Used as the benchmark solution to measure HGS optimization gains and economic savings.
 */
export function generateBaselineSolution(
  problem: CVRPProblem,
  distanceMatrix: DistanceMatrix
): CVRPSolution {
  const unvisited = new Set<number>(problem.customers.map(c => c.id));
  const demandMap = new Map<number, number>(problem.customers.map(c => [c.id, c.demand]));

  const routes: Route[] = [];
  let vehicleId = 1;

  while (unvisited.size > 0) {
    let currentCustomer = 0; // Start at depot
    let currentLoad = 0;
    const routeCustomerIds: number[] = [];

    while (unvisited.size > 0) {
      // Find closest unvisited customer that fits in vehicle capacity
      let bestCandidate = -1;
      let minDistance = Infinity;

      for (const candidateId of unvisited) {
        const demand = demandMap.get(candidateId) || 0;
        if (currentLoad + demand <= problem.vehicleCapacity) {
          const dist = distanceMatrix.get(currentCustomer, candidateId);
          if (dist < minDistance) {
            minDistance = dist;
            bestCandidate = candidateId;
          }
        }
      }

      // If no fitting candidate found, must return to depot and start a new vehicle route
      if (bestCandidate === -1) {
        // If the vehicle is completely empty but no customer fits, take the candidate with smallest demand anyway
        if (routeCustomerIds.length === 0) {
          let smallestCand = -1;
          let minDem = Infinity;
          for (const cand of unvisited) {
            const dem = demandMap.get(cand) || 0;
            if (dem < minDem) {
              minDem = dem;
              smallestCand = cand;
            }
          }
          bestCandidate = smallestCand;
        } else {
          break; // Close this route
        }
      }

      const candDemand = demandMap.get(bestCandidate) || 0;
      currentLoad += candDemand;
      routeCustomerIds.push(bestCandidate);
      unvisited.delete(bestCandidate);
      currentCustomer = bestCandidate;
    }

    const routeDistance = distanceMatrix.calculateRouteDistance(routeCustomerIds);
    routes.push({
      vehicleId: vehicleId++,
      customerIds: routeCustomerIds,
      load: currentLoad,
      distance: routeDistance,
      feasible: currentLoad <= problem.vehicleCapacity,
    });
  }

  let totalDistance = 0;
  for (const r of routes) {
    totalDistance += r.distance;
  }

  const validation = validateSolution({ routes }, problem);
  const excessVehicles = Math.max(0, routes.length - problem.vehicleCount);
  let excessLoad = 0;
  for (const r of routes) {
    excessLoad += Math.max(0, r.load - problem.vehicleCapacity);
  }

  const baselineSol: CVRPSolution = {
    id: 'baseline-nn',
    routes,
    totalDistance,
    feasible: validation.feasible,
    vehiclesUsed: routes.length,
    validation,
    penalizedCost: totalDistance + 1000 * excessLoad + 5000 * excessVehicles,
    giantTour: [],
  };

  baselineSol.giantTour = extractGiantTour(baselineSol);
  return baselineSol;
}

/**
 * Creates an initial diverse population of CVRP solutions using multiple heuristics:
 * 1. Nearest Neighbor giant tour
 * 2. Angular sweep tours (Gillett & Miller)
 * 3. Randomized greedy heuristic
 * 4. Shuffled random giant tours
 */
export function generateInitialPopulation(
  problem: CVRPProblem,
  distanceMatrix: DistanceMatrix,
  populationSize: number,
  rng: Mulberry32,
  enableLocalSearch: boolean = true,
  penaltyCapacity: number = 1000,
  penaltyFleet: number = 5000
): CVRPSolution[] {
  const population: CVRPSolution[] = [];
  const allCustomerIds = problem.customers.map(c => c.id);

  if (allCustomerIds.length === 0) {
    return population;
  }

  // 1. Angular Sweep Heuristics (polar angle around depot)
  const angles = problem.customers.map(c => ({
    id: c.id,
    angle: Math.atan2(c.y - problem.depot.y, c.x - problem.depot.x),
  }));

  // Ascending angle
  const sweepAsc = [...angles].sort((a, b) => a.angle - b.angle).map(a => a.id);
  const solSweepAsc = splitGiantTour(sweepAsc, problem, distanceMatrix, penaltyCapacity, penaltyFleet);
  population.push(enableLocalSearch ? applyLocalSearch(solSweepAsc, problem, distanceMatrix) : solSweepAsc);

  // Descending angle
  const sweepDesc = [...sweepAsc].reverse();
  const solSweepDesc = splitGiantTour(sweepDesc, problem, distanceMatrix, penaltyCapacity, penaltyFleet);
  population.push(enableLocalSearch ? applyLocalSearch(solSweepDesc, problem, distanceMatrix) : solSweepDesc);

  // 2. Nearest Neighbor tour
  const nnBaseline = generateBaselineSolution(problem, distanceMatrix);
  const nnTour = nnBaseline.giantTour || extractGiantTour(nnBaseline);
  const solNN = splitGiantTour(nnTour, problem, distanceMatrix, penaltyCapacity, penaltyFleet);
  population.push(enableLocalSearch ? applyLocalSearch(solNN, problem, distanceMatrix) : solNN);

  // 3. Angle-offset sweeps
  const offsetSteps = [Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];
  for (const offset of offsetSteps) {
    if (population.length >= populationSize) break;
    const shifted = [...angles]
      .map(a => ({ id: a.id, angle: (a.angle + offset + 2 * Math.PI) % (2 * Math.PI) }))
      .sort((a, b) => a.angle - b.angle)
      .map(a => a.id);

    const solShifted = splitGiantTour(shifted, problem, distanceMatrix, penaltyCapacity, penaltyFleet);
    population.push(enableLocalSearch ? applyLocalSearch(solShifted, problem, distanceMatrix) : solShifted);
  }

  // 4. Fill remaining population with Randomized Greedy & Permutations
  while (population.length < populationSize) {
    const isGreedy = rng.nextFloat() < 0.5;

    let tour: number[];
    if (isGreedy) {
      // Randomized Greedy: pick among top 3 nearest unvisited
      const unvisited = [...allCustomerIds];
      tour = [];
      let current = 0; // depot

      while (unvisited.length > 0) {
        // Sort remaining by distance to current
        unvisited.sort((a, b) => distanceMatrix.get(current, a) - distanceMatrix.get(current, b));
        const pickRange = Math.min(3, unvisited.length);
        const pickIdx = rng.nextInt(0, pickRange - 1);
        const chosen = unvisited.splice(pickIdx, 1)[0];
        tour.push(chosen);
        current = chosen;
      }
    } else {
      // Shuffled random permutation
      tour = rng.shuffle(allCustomerIds);
    }

    const sol = splitGiantTour(tour, problem, distanceMatrix, penaltyCapacity, penaltyFleet);
    // Apply local search on a fraction of random individuals to maintain diversity without stalling
    const runLS = enableLocalSearch && rng.nextFloat() < 0.4;
    population.push(runLS ? applyLocalSearch(sol, problem, distanceMatrix) : sol);
  }

  return population;
}
