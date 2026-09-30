import type { CustomerNode, DepotNode } from '../../types/vrp';

export interface ProblemValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  distanceMatrix: number[][];
}

export function getDistance(n1: { x: number; y: number }, n2: { x: number; y: number }): number {
  const dx = n1.x - n2.x;
  const dy = n1.y - n2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function validateRoutingProblem(
  depot: DepotNode,
  customers: CustomerNode[]
): ProblemValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!depot || !depot.isDepot) {
    errors.push('Invalid or missing central depot node.');
  }

  if (!customers || customers.length === 0) {
    errors.push('Customer list cannot be empty.');
  }

  if (customers.length > 8) {
    warnings.push(
      `Full QAOA QUBO on ${customers.length} customers requires ${customers.length * customers.length} qubits. Applying exact sub-routing formulation or sampling scaling.`
    );
  }

  const allNodes = [depot, ...customers];
  const numNodes = allNodes.length;
  const distanceMatrix: number[][] = Array.from({ length: numNodes }, () =>
    Array(numNodes).fill(0)
  );

  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      if (i === j) {
        distanceMatrix[i][j] = 0;
      } else {
        const dist = Math.round(getDistance(allNodes[i], allNodes[j]));
        distanceMatrix[i][j] = dist;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    distanceMatrix,
  };
}
