import type { CustomerNode, DepotNode } from '../../types/vrp';
import type { QUBOFormulation } from './types';
import { getDistance } from './validator';

export function buildRoutingQUBO(
  depot: DepotNode,
  customers: CustomerNode[],
  penaltyA: number = 500,
  penaltyB: number = 500
): QUBOFormulation {
  const N = customers.length;
  const numVariables = N * N; // x_{i, t} where i = city (0..N-1), t = order position (0..N-1)

  const variableNames: string[] = [];
  for (let i = 0; i < N; i++) {
    for (let t = 0; t < N; t++) {
      variableNames.push(`x_${customers[i].id}_step${t}`);
    }
  }

  const varIndex = (cityIdx: number, stepIdx: number) => cityIdx * N + stepIdx;

  const matrix: number[][] = Array.from({ length: numVariables }, () =>
    Array(numVariables).fill(0)
  );

  let constant = 0;

  // 1. Distance Objective Terms
  // Distance from Depot to first city (t = 0)
  for (let i = 0; i < N; i++) {
    const dDepot = getDistance(depot, customers[i]);
    const u = varIndex(i, 0);
    matrix[u][u] += dDepot;
  }

  // Distance between city i (at step t) and city j (at step t+1)
  for (let t = 0; t < N - 1; t++) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i !== j) {
          const dIJ = getDistance(customers[i], customers[j]);
          const u = varIndex(i, t);
          const v = varIndex(j, t + 1);
          matrix[u][v] += dIJ / 2;
          matrix[v][u] += dIJ / 2;
        }
      }
    }
  }

  // Distance from last city (t = N-1) back to Depot
  for (let i = 0; i < N; i++) {
    const dDepot = getDistance(customers[i], depot);
    const u = varIndex(i, N - 1);
    matrix[u][u] += dDepot;
  }

  // 2. Constraint Penalty A: Each city i is visited at exactly one position t
  // ( sum_t x_{i, t} - 1 )^2 = sum_t x_{i,t}^2 - 2 sum_t x_{i,t} + 2 sum_{t < t'} x_{i,t} x_{i,t'} + 1
  // Since x^2 = x: = - sum_t x_{i,t} + 2 sum_{t < t'} x_{i,t} x_{i,t'} + 1
  for (let i = 0; i < N; i++) {
    constant += penaltyA;
    for (let t = 0; t < N; t++) {
      const u = varIndex(i, t);
      matrix[u][u] -= penaltyA;
      for (let t2 = t + 1; t2 < N; t2++) {
        const v = varIndex(i, t2);
        matrix[u][v] += penaltyA;
        matrix[v][u] += penaltyA;
      }
    }
  }

  // 3. Constraint Penalty B: Each position t has exactly one city i
  // ( sum_i x_{i, t} - 1 )^2 = - sum_i x_{i,t} + 2 sum_{i < j} x_{i,t} x_{j,t} + 1
  for (let t = 0; t < N; t++) {
    constant += penaltyB;
    for (let i = 0; i < N; i++) {
      const u = varIndex(i, t);
      matrix[u][u] -= penaltyB;
      for (let j = i + 1; j < N; j++) {
        const v = varIndex(j, t);
        matrix[u][v] += penaltyB;
        matrix[v][u] += penaltyB;
      }
    }
  }

  return {
    numVariables,
    matrix,
    constant,
    variableNames,
  };
}
