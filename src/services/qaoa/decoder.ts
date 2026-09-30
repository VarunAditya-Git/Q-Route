import type { CustomerNode } from '../../types/vrp';

export interface DecodedCandidate {
  rawBitstring: string;
  assignedOrder: (string | null)[];
  visitedCustomerIds: string[];
  unvisitedCustomerIds: string[];
  hasDuplicates: boolean;
}

export function decodeBitstringToRoute(
  bitstring: string,
  customers: CustomerNode[]
): DecodedCandidate {
  const N = customers.length;

  // The bitstring has M = N * N bits.
  // x_{i, t} is at index i * N + t.
  const assignedOrder: (string | null)[] = Array(N).fill(null);
  const visitedSet = new Set<string>();

  for (let i = 0; i < N; i++) {
    for (let t = 0; t < N; t++) {
      const idx = i * N + t;
      if (idx < bitstring.length && bitstring[idx] === '1') {
        const customerId = customers[i].id;
        if (assignedOrder[t] === null) {
          assignedOrder[t] = customerId;
        }
        visitedSet.add(customerId);
      }
    }
  }

  const visitedCustomerIds = Array.from(visitedSet);
  const unvisitedCustomerIds = customers
    .map(c => c.id)
    .filter(id => !visitedSet.has(id));

  const filledCount = assignedOrder.filter(id => id !== null).length;
  const hasDuplicates = visitedCustomerIds.length !== filledCount;

  return {
    rawBitstring: bitstring,
    assignedOrder,
    visitedCustomerIds,
    unvisitedCustomerIds,
    hasDuplicates,
  };
}
