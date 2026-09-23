// Precomputed Euclidean Distance Matrix for CVRP
import type { CVRPProblem } from './types';

export class DistanceMatrix {
  private matrix: Float64Array[];
  private size: number;

  constructor(problem: CVRPProblem) {
    this.size = problem.customers.length + 1; // 0 = depot, 1..N = customers
    this.matrix = new Array(this.size);

    // Build coordinate list where index 0 is depot, index 1..N is customer 1..N
    const coords: { x: number; y: number }[] = new Array(this.size);
    coords[0] = { x: problem.depot.x, y: problem.depot.y };

    for (const cust of problem.customers) {
      coords[cust.id] = { x: cust.x, y: cust.y };
    }

    // Precalculate all Euclidean distances
    for (let i = 0; i < this.size; i++) {
      this.matrix[i] = new Float64Array(this.size);
      const c1 = coords[i];
      for (let j = 0; j < this.size; j++) {
        if (i === j) {
          this.matrix[i][j] = 0;
        } else {
          const c2 = coords[j];
          const dx = c1.x - c2.x;
          const dy = c1.y - c2.y;
          this.matrix[i][j] = Math.sqrt(dx * dx + dy * dy);
        }
      }
    }
  }

  // Get distance between node i and node j (0 = depot)
  get(i: number, j: number): number {
    return this.matrix[i][j];
  }

  // Calculate the total distance of a route starting at depot (0), visiting sequence, and returning to depot (0)
  calculateRouteDistance(customerIds: number[]): number {
    if (customerIds.length === 0) return 0;

    let dist = this.matrix[0][customerIds[0]];
    for (let i = 0; i < customerIds.length - 1; i++) {
      dist += this.matrix[customerIds[i]][customerIds[i + 1]];
    }
    dist += this.matrix[customerIds[customerIds.length - 1]][0];
    return dist;
  }
}
