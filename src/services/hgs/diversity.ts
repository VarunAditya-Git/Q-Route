// Diversity Management and Biased Fitness Ranking according to Vidal (2022)
import type { CVRPSolution } from './types';

/**
 * Extracts the set of undirected customer-to-customer and customer-to-depot edges from a solution.
 * A key string "minId-maxId" represents an undirected edge.
 */
export function extractEdgeSet(solution: CVRPSolution): Set<string> {
  const edges = new Set<string>();

  for (const route of solution.routes) {
    const custs = route.customerIds;
    if (custs.length === 0) continue;

    // Edge from depot (0) to first customer
    const first = custs[0];
    edges.add(`0-${first}`);

    // Edges between consecutive customers
    for (let i = 0; i < custs.length - 1; i++) {
      const u = custs[i];
      const v = custs[i + 1];
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      edges.add(key);
    }

    // Edge from last customer back to depot (0)
    const last = custs[custs.length - 1];
    edges.add(`0-${last}`);
  }

  return edges;
}

/**
 * Computes the normalized broken-pairs distance between two CVRP solutions.
 * Returns a value in [0, 1], where 0 means identical edge sets and 1 means completely disjoint.
 */
export function brokenPairsDistance(sol1: CVRPSolution, sol2: CVRPSolution): number {
  const edges1 = extractEdgeSet(sol1);
  const edges2 = extractEdgeSet(sol2);

  if (edges1.size === 0 && edges2.size === 0) return 0;

  let common = 0;
  for (const edge of edges1) {
    if (edges2.has(edge)) {
      common++;
    }
  }

  const maxEdges = Math.max(edges1.size, edges2.size);
  if (maxEdges === 0) return 0;

  // Broken-pairs distance = fraction of edges that differ
  return 1 - common / maxEdges;
}

/**
 * Computes the average pairwise diversity across an entire population.
 */
export function computePopulationDiversity(population: CVRPSolution[]): number {
  if (population.length < 2) return 0;

  let totalDist = 0;
  let pairs = 0;

  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      totalDist += brokenPairsDistance(population[i], population[j]);
      pairs++;
    }
  }

  return pairs > 0 ? totalDist / pairs : 0;
}

/**
 * Updates the diversity contribution and biased fitness for all individuals in a population.
 * Implements Vidal (2022) Equation for Biased Fitness:
 * B(S) = rank_fit(S) + (1 - nbElite / mu) * rank_div(S)
 */
export function calculateBiasedFitness(
  population: CVRPSolution[],
  nbElite: number = 4
): void {
  const mu = population.length;
  if (mu === 0) return;
  if (mu === 1) {
    population[0].diversityContribution = 1.0;
    population[0].biasedFitness = 1.0;
    return;
  }

  // 1. Calculate distance matrix between all individuals in population
  const distMatrix: number[][] = Array.from({ length: mu }, () => new Array(mu).fill(0));
  for (let i = 0; i < mu; i++) {
    for (let j = i + 1; j < mu; j++) {
      const d = brokenPairsDistance(population[i], population[j]);
      distMatrix[i][j] = d;
      distMatrix[j][i] = d;
    }
  }

  // 2. Compute diversity contribution for each individual as average distance to nClose neighbors
  const nClose = Math.min(mu - 1, Math.max(1, Math.floor(mu / 5)));

  for (let i = 0; i < mu; i++) {
    const distances = distMatrix[i].filter((_, idx) => idx !== i);
    distances.sort((a, b) => a - b);
    const closest = distances.slice(0, nClose);
    const avgClose = closest.reduce((acc, v) => acc + v, 0) / nClose;
    population[i].diversityContribution = avgClose;
  }

  // 3. Rank individuals by cost (penalizedCost ascending: rank 1 is best)
  const costSortedIndices = Array.from({ length: mu }, (_, i) => i).sort(
    (a, b) => population[a].penalizedCost - population[b].penalizedCost
  );
  const costRanks = new Array(mu);
  for (let rank = 0; rank < mu; rank++) {
    costRanks[costSortedIndices[rank]] = rank + 1; // 1-indexed
  }

  // 4. Rank individuals by diversity contribution (descending: rank 1 is most diverse)
  const divSortedIndices = Array.from({ length: mu }, (_, i) => i).sort(
    (a, b) => (population[b].diversityContribution || 0) - (population[a].diversityContribution || 0)
  );
  const divRanks = new Array(mu);
  for (let rank = 0; rank < mu; rank++) {
    divRanks[divSortedIndices[rank]] = rank + 1; // 1-indexed
  }

  // 5. Compute Biased Fitness
  const eliteRatio = Math.min(1.0, Math.max(0, nbElite / mu));
  const diversityWeight = 1.0 - eliteRatio;

  for (let i = 0; i < mu; i++) {
    const rankFit = costRanks[i];
    const rankDiv = divRanks[i];
    population[i].biasedFitness = rankFit + diversityWeight * rankDiv;
  }
}
