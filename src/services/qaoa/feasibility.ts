import type { CustomerNode } from '../../types/vrp';
import type { DecodedCandidate } from './decoder';

export interface FeasibilityAssessment {
  isFeasible: boolean;
  violations: string[];
  violationCount: number;
  reconstructedRouteIds: string[];
  wasRepaired: boolean;
}

export function evaluateRouteFeasibility(
  candidate: DecodedCandidate,
  customers: CustomerNode[]
): FeasibilityAssessment {
  const violations: string[] = [];
  const N = customers.length;

  // 1. Check if every customer is visited exactly once
  if (candidate.visitedCustomerIds.length < N) {
    const missing = candidate.unvisitedCustomerIds.join(', ');
    violations.push(`Missing customers in candidate bitstring: ${missing}`);
  }

  // 2. Check position collisions / unassigned slots
  const nullSlots = candidate.assignedOrder.filter(x => x === null).length;
  if (nullSlots > 0) {
    violations.push(`${nullSlots} order positions were left unassigned by quantum sampling.`);
  }

  if (candidate.hasDuplicates) {
    violations.push('Position assignment collisions detected (multiple cities at same position).');
  }

  const isFeasible = violations.length === 0;

  // 3. Documented Repair Strategy:
  // If infeasible, build a valid route by maintaining validly assigned nodes in order,
  // and inserting missing customer nodes into empty/collided slots.
  let reconstructedRouteIds: string[] = [];
  let wasRepaired = false;

  if (isFeasible) {
    reconstructedRouteIds = candidate.assignedOrder as string[];
  } else {
    wasRepaired = true;
    const used = new Set<string>();
    const order: string[] = [];

    for (let t = 0; t < N; t++) {
      const id = candidate.assignedOrder[t];
      if (id && !used.has(id)) {
        order.push(id);
        used.add(id);
      }
    }

    // Append unvisited customers in natural sequence
    for (const cust of customers) {
      if (!used.has(cust.id)) {
        order.push(cust.id);
        used.add(cust.id);
      }
    }

    reconstructedRouteIds = order;
  }

  return {
    isFeasible,
    violations,
    violationCount: violations.length,
    reconstructedRouteIds,
    wasRepaired,
  };
}
