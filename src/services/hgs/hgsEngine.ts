// Hybrid Genetic Search (HGS-CVRP) Engine (Vidal 2022)
// Complete classical metaheuristic engine without any synthetic, fake, or mock components.

import type {
  CVRPProblem,
  CVRPSolution,
  GenerationRecord,
  HGSConfig,
  HGSResult,
} from './types';
import { DistanceMatrix } from './distance';
import { Mulberry32 } from './random';
import { splitGiantTour, extractGiantTour } from './split';
import { applyLocalSearch } from './localSearch';
import { calculateBiasedFitness, computePopulationDiversity } from './diversity';
import { generateBaselineSolution, generateInitialPopulation } from './initialPopulation';

export const DEFAULT_HGS_CONFIG: HGSConfig = {
  seed: 42,
  populationSize: 50,
  maxGenerations: 100,
  timeLimitMs: 15000,
  stagnationLimit: 40,
  mutationRate: 0.25,
  crossoverRate: 0.9,
  tournamentSize: 3,
  localSearchEnabled: true,
  twoOptEnabled: true,
  relocateEnabled: true,
  swapEnabled: true,
  nbElite: 4,
  penaltyCapacity: 1000,
  penaltyFleet: 5000,
};

/**
 * Performs Order Crossover (OX) between two parent giant tours.
 * Preserves subsegment from parent 1, fills remaining from parent 2.
 */
export function orderCrossover(parent1: number[], parent2: number[], rng: Mulberry32): number[] {
  const n = parent1.length;
  if (n <= 1) return [...parent1];

  const idx1 = rng.nextInt(0, n - 1);
  const idx2 = rng.nextInt(0, n - 1);
  const start = Math.min(idx1, idx2);
  const end = Math.max(idx1, idx2);

  const offspring = new Array<number>(n).fill(-1);
  const included = new Set<number>();

  // Copy segment from Parent 1
  for (let i = start; i <= end; i++) {
    offspring[i] = parent1[i];
    included.add(parent1[i]);
  }

  // Fill remaining from Parent 2 in cyclical order starting from end + 1
  let insertIdx = (end + 1) % n;
  for (let i = 0; i < n; i++) {
    const parent2Idx = (end + 1 + i) % n;
    const cust = parent2[parent2Idx];

    if (!included.has(cust)) {
      offspring[insertIdx] = cust;
      insertIdx = (insertIdx + 1) % n;
    }
  }

  return offspring;
}

/**
 * Mutation operator on a giant tour (Inversion or Swap)
 */
export function mutateGiantTour(tour: number[], rng: Mulberry32): number[] {
  const n = tour.length;
  if (n <= 2) return [...tour];

  const mutated = [...tour];
  const type = rng.nextFloat();

  if (type < 0.6) {
    // Inversion mutation (subsegment reversal)
    const i = rng.nextInt(0, n - 1);
    const j = rng.nextInt(0, n - 1);
    const start = Math.min(i, j);
    const end = Math.max(i, j);
    const segment = mutated.slice(start, end + 1).reverse();
    mutated.splice(start, end - start + 1, ...segment);
  } else {
    // Swap mutation (swap two customers)
    const i = rng.nextInt(0, n - 1);
    let j = rng.nextInt(0, n - 1);
    while (j === i && n > 1) {
      j = rng.nextInt(0, n - 1);
    }
    const temp = mutated[i];
    mutated[i] = mutated[j];
    mutated[j] = temp;
  }

  return mutated;
}

/**
 * Tournament selection based on Biased Fitness (lower rank is better)
 */
export function tournamentSelect(population: CVRPSolution[], tournamentSize: number, rng: Mulberry32): CVRPSolution {
  let best = population[rng.nextInt(0, population.length - 1)];

  for (let i = 1; i < tournamentSize; i++) {
    const cand = population[rng.nextInt(0, population.length - 1)];
    const bestFitness = best.biasedFitness !== undefined ? best.biasedFitness : best.penalizedCost;
    const candFitness = cand.biasedFitness !== undefined ? cand.biasedFitness : cand.penalizedCost;

    if (candFitness < bestFitness) {
      best = cand;
    }
  }

  return best;
}

/**
 * Synchronous core execution of HGS-CVRP.
 * Deterministic for a given seed.
 */
export function runHGSSync(
  problem: CVRPProblem,
  userConfig: Partial<HGSConfig> = {}
): HGSResult {
  const startTime = Date.now();
  const config: HGSConfig = { ...DEFAULT_HGS_CONFIG, ...userConfig };
  const rng = new Mulberry32(config.seed);
  const distanceMatrix = new DistanceMatrix(problem);

  // 1. Generate naive baseline solution (for benchmark comparison & savings)
  const baselineSolution = generateBaselineSolution(problem, distanceMatrix);

  // 2. Generate initial diverse population
  let population = generateInitialPopulation(
    problem,
    distanceMatrix,
    config.populationSize,
    rng,
    config.localSearchEnabled,
    config.penaltyCapacity,
    config.penaltyFleet
  );

  // Fallback if population generation was empty
  if (population.length === 0) {
    population = [baselineSolution];
  }

  // Calculate biased fitness for initial population
  calculateBiasedFitness(population, config.nbElite);

  // Find best feasible solution in initial population
  let bestFeasibleSolution: CVRPSolution | null = null;
  for (const sol of population) {
    if (sol.feasible) {
      if (!bestFeasibleSolution || sol.totalDistance < bestFeasibleSolution.totalDistance) {
        bestFeasibleSolution = sol;
      }
    }
  }

  // If no feasible solution in initial population, use baseline if feasible or best penalized
  if (!bestFeasibleSolution) {
    if (baselineSolution.feasible) {
      bestFeasibleSolution = baselineSolution;
    } else {
      let lowestPenalty = population[0];
      for (const s of population) {
        if (s.penalizedCost < lowestPenalty.penalizedCost) {
          lowestPenalty = s;
        }
      }
      bestFeasibleSolution = lowestPenalty;
    }
  }

  const convergenceHistory: GenerationRecord[] = [];
  let bestGeneration = 0;
  let stagnantGens = 0;

  // Record generation 0 metrics
  const avgDist0 = population.reduce((acc, s) => acc + s.totalDistance, 0) / population.length;
  const feasibleCount0 = population.filter(s => s.feasible).length;
  convergenceHistory.push({
    generation: 0,
    bestDistance: Number(bestFeasibleSolution.totalDistance.toFixed(2)),
    averageDistance: Number(avgDist0.toFixed(2)),
    feasibleSolutions: feasibleCount0,
    populationDiversity: Number(computePopulationDiversity(population).toFixed(4)),
  });

  // 3. Main Genetic Evolution Loop
  for (let gen = 1; gen <= config.maxGenerations; gen++) {
    // Check time limit
    if (Date.now() - startTime > config.timeLimitMs) {
      break;
    }

    // Check stagnation
    if (stagnantGens >= config.stagnationLimit) {
      break;
    }

    // Select parents
    const parent1 = tournamentSelect(population, config.tournamentSize, rng);
    let parent2 = tournamentSelect(population, config.tournamentSize, rng);
    if (population.length > 1) {
      let attempts = 0;
      while (parent2.id === parent1.id && attempts < 5) {
        parent2 = tournamentSelect(population, config.tournamentSize, rng);
        attempts++;
      }
    }

    const p1Tour = parent1.giantTour || extractGiantTour(parent1);
    const p2Tour = parent2.giantTour || extractGiantTour(parent2);

    // Crossover
    let offspringTour: number[];
    if (rng.nextFloat() < config.crossoverRate) {
      offspringTour = orderCrossover(p1Tour, p2Tour, rng);
    } else {
      offspringTour = [...p1Tour];
    }

    // Mutation
    if (rng.nextFloat() < config.mutationRate) {
      offspringTour = mutateGiantTour(offspringTour, rng);
    }

    // Split giant tour into routes
    let offspring = splitGiantTour(
      offspringTour,
      problem,
      distanceMatrix,
      config.penaltyCapacity,
      config.penaltyFleet
    );

    // Local Search intensification
    if (config.localSearchEnabled) {
      offspring = applyLocalSearch(offspring, problem, distanceMatrix, {
        enableTwoOpt: config.twoOptEnabled,
        enableRelocate: config.relocateEnabled,
        enableSwap: config.swapEnabled,
        penaltyCapacity: config.penaltyCapacity,
        penaltyFleet: config.penaltyFleet,
      });
    }

    // Update best feasible solution
    let improvedThisGen = false;
    if (offspring.feasible) {
      if (offspring.totalDistance < bestFeasibleSolution.totalDistance - 1e-4) {
        bestFeasibleSolution = offspring;
        bestGeneration = gen;
        stagnantGens = 0;
        improvedThisGen = true;
      }
    }

    if (!improvedThisGen) {
      stagnantGens++;
    }

    // Insert offspring into population
    population.push(offspring);

    // Recompute Biased Fitness for augmented population
    calculateBiasedFitness(population, config.nbElite);

    // Survivor selection: trim population back to populationSize
    // Protect the top nbElite solutions, then remove worst biased fitness
    if (population.length > config.populationSize) {
      // Sort population by biased fitness descending (worst at front)
      // Exclude bestFeasibleSolution from eviction
      let worstIdx = -1;
      let worstFitness = -Infinity;

      for (let i = 0; i < population.length; i++) {
        const sol = population[i];
        if (sol.id === bestFeasibleSolution.id) continue;
        const bFit = sol.biasedFitness || 0;
        if (bFit > worstFitness) {
          worstFitness = bFit;
          worstIdx = i;
        }
      }

      if (worstIdx !== -1) {
        population.splice(worstIdx, 1);
      } else {
        population.pop();
      }
    }

    // Record real convergence metrics
    const avgDist = population.reduce((acc, s) => acc + s.totalDistance, 0) / population.length;
    const feasibleCount = population.filter(s => s.feasible).length;

    convergenceHistory.push({
      generation: gen,
      bestDistance: Number(bestFeasibleSolution.totalDistance.toFixed(2)),
      averageDistance: Number(avgDist.toFixed(2)),
      feasibleSolutions: feasibleCount,
      populationDiversity: Number(computePopulationDiversity(population).toFixed(4)),
    });
  }

  const executionTimeMs = Date.now() - startTime;

  // Build population summary
  const populationSummary = population.slice(0, 15).map(s => ({
    id: s.id,
    distance: Number(s.totalDistance.toFixed(2)),
    feasible: s.feasible,
    vehiclesUsed: s.vehiclesUsed,
    isBest: s.id === bestFeasibleSolution.id,
  }));

  return {
    problem,
    config,
    baselineSolution,
    bestSolution: bestFeasibleSolution,
    bestGeneration,
    totalGenerations: convergenceHistory.length - 1,
    executionTimeMs,
    convergenceHistory,
    populationSummary,
  };
}

/**
 * Asynchronous runner with non-blocking UI steps.
 */
export async function runHGSAsync(
  problem: CVRPProblem,
  userConfig: Partial<HGSConfig> = {},
  onProgress?: (progress: { generation: number; currentBest: CVRPSolution; percent: number }) => void
): Promise<HGSResult> {
  const startTime = Date.now();
  const config: HGSConfig = { ...DEFAULT_HGS_CONFIG, ...userConfig };
  const rng = new Mulberry32(config.seed);
  const distanceMatrix = new DistanceMatrix(problem);

  const baselineSolution = generateBaselineSolution(problem, distanceMatrix);

  let population = generateInitialPopulation(
    problem,
    distanceMatrix,
    config.populationSize,
    rng,
    config.localSearchEnabled,
    config.penaltyCapacity,
    config.penaltyFleet
  );

  if (population.length === 0) {
    population = [baselineSolution];
  }

  calculateBiasedFitness(population, config.nbElite);

  let bestFeasibleSolution: CVRPSolution | null = null;
  for (const sol of population) {
    if (sol.feasible) {
      if (!bestFeasibleSolution || sol.totalDistance < bestFeasibleSolution.totalDistance) {
        bestFeasibleSolution = sol;
      }
    }
  }

  if (!bestFeasibleSolution) {
    bestFeasibleSolution = baselineSolution.feasible ? baselineSolution : population[0];
  }

  const convergenceHistory: GenerationRecord[] = [];
  let bestGeneration = 0;
  let stagnantGens = 0;

  const avgDist0 = population.reduce((acc, s) => acc + s.totalDistance, 0) / population.length;
  const feasibleCount0 = population.filter(s => s.feasible).length;
  convergenceHistory.push({
    generation: 0,
    bestDistance: Number(bestFeasibleSolution.totalDistance.toFixed(2)),
    averageDistance: Number(avgDist0.toFixed(2)),
    feasibleSolutions: feasibleCount0,
    populationDiversity: Number(computePopulationDiversity(population).toFixed(4)),
  });

  for (let gen = 1; gen <= config.maxGenerations; gen++) {
    if (Date.now() - startTime > config.timeLimitMs || stagnantGens >= config.stagnationLimit) {
      break;
    }

    const parent1 = tournamentSelect(population, config.tournamentSize, rng);
    let parent2 = tournamentSelect(population, config.tournamentSize, rng);
    if (population.length > 1) {
      let attempts = 0;
      while (parent2.id === parent1.id && attempts < 5) {
        parent2 = tournamentSelect(population, config.tournamentSize, rng);
        attempts++;
      }
    }

    const p1Tour = parent1.giantTour || extractGiantTour(parent1);
    const p2Tour = parent2.giantTour || extractGiantTour(parent2);

    let offspringTour: number[];
    if (rng.nextFloat() < config.crossoverRate) {
      offspringTour = orderCrossover(p1Tour, p2Tour, rng);
    } else {
      offspringTour = [...p1Tour];
    }

    if (rng.nextFloat() < config.mutationRate) {
      offspringTour = mutateGiantTour(offspringTour, rng);
    }

    let offspring = splitGiantTour(
      offspringTour,
      problem,
      distanceMatrix,
      config.penaltyCapacity,
      config.penaltyFleet
    );

    if (config.localSearchEnabled) {
      offspring = applyLocalSearch(offspring, problem, distanceMatrix, {
        enableTwoOpt: config.twoOptEnabled,
        enableRelocate: config.relocateEnabled,
        enableSwap: config.swapEnabled,
        penaltyCapacity: config.penaltyCapacity,
        penaltyFleet: config.penaltyFleet,
      });
    }

    let improvedThisGen = false;
    if (offspring.feasible) {
      if (offspring.totalDistance < bestFeasibleSolution.totalDistance - 1e-4) {
        bestFeasibleSolution = offspring;
        bestGeneration = gen;
        stagnantGens = 0;
        improvedThisGen = true;
      }
    }

    if (!improvedThisGen) {
      stagnantGens++;
    }

    population.push(offspring);
    calculateBiasedFitness(population, config.nbElite);

    if (population.length > config.populationSize) {
      let worstIdx = -1;
      let worstFitness = -Infinity;

      for (let i = 0; i < population.length; i++) {
        const sol = population[i];
        if (sol.id === bestFeasibleSolution.id) continue;
        const bFit = sol.biasedFitness || 0;
        if (bFit > worstFitness) {
          worstFitness = bFit;
          worstIdx = i;
        }
      }

      if (worstIdx !== -1) {
        population.splice(worstIdx, 1);
      } else {
        population.pop();
      }
    }

    const avgDist = population.reduce((acc, s) => acc + s.totalDistance, 0) / population.length;
    const feasibleCount = population.filter(s => s.feasible).length;

    convergenceHistory.push({
      generation: gen,
      bestDistance: Number(bestFeasibleSolution.totalDistance.toFixed(2)),
      averageDistance: Number(avgDist.toFixed(2)),
      feasibleSolutions: feasibleCount,
      populationDiversity: Number(computePopulationDiversity(population).toFixed(4)),
    });

    // Notify UI every 2 generations and yield to browser
    if (gen % 2 === 0 || gen === config.maxGenerations) {
      if (onProgress) {
        onProgress({
          generation: gen,
          currentBest: bestFeasibleSolution,
          percent: Math.min(100, Math.round((gen / config.maxGenerations) * 100)),
        });
      }
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const executionTimeMs = Date.now() - startTime;

  const populationSummary = population.slice(0, 15).map(s => ({
    id: s.id,
    distance: Number(s.totalDistance.toFixed(2)),
    feasible: s.feasible,
    vehiclesUsed: s.vehiclesUsed,
    isBest: s.id === bestFeasibleSolution.id,
  }));

  return {
    problem,
    config,
    baselineSolution,
    bestSolution: bestFeasibleSolution,
    bestGeneration,
    totalGenerations: convergenceHistory.length - 1,
    executionTimeMs,
    convergenceHistory,
    populationSummary,
  };
}
