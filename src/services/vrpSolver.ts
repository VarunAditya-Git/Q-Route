import type { 
  CustomerNode, 
  DepotNode, 
  Vehicle, 
  VRPProblemConfig, 
  QuantumExecutionData 
} from '../types/vrp';
import type { CVRPProblem, Customer, Route } from './hgs/types';
import { Mulberry32 } from './hgs/random';

// Vibrant vehicle color palette
export const VEHICLE_COLORS = [
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// Helper: Calculate Euclidean distance
export function getDistance(n1: { x: number; y: number }, n2: { x: number; y: number }): number {
  const dx = n1.x - n2.x;
  const dy = n1.y - n2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generate Problem Instance deterministically based on seed and configuration
 */
export function generateVRPProblem(config: VRPProblemConfig): { depot: DepotNode; customers: CustomerNode[] } {
  const seed = config.seed ?? 42;
  const rng = new Mulberry32(seed);

  // Determine Depot Position
  let depotX = 500;
  let depotY = 500;

  if (config.depotLocation === 'corner') {
    depotX = 150;
    depotY = 150;
  } else if (config.depotLocation === 'random') {
    depotX = Math.round(200 + rng.nextFloat() * 600);
    depotY = Math.round(200 + rng.nextFloat() * 600);
  }

  const depot: DepotNode = {
    id: 'DEPOT',
    name: 'Central Logistics Hub',
    x: Math.round(depotX),
    y: Math.round(depotY),
    demand: 0,
    isDepot: true,
  };

  const customers: CustomerNode[] = [];

  for (let i = 1; i <= config.customerCount; i++) {
    let x = 0;
    let y = 0;

    if (config.distribution === 'clustered') {
      const clusterId = i % 4;
      const centers = [
        { x: 250, y: 250 },
        { x: 750, y: 250 },
        { x: 250, y: 750 },
        { x: 750, y: 750 },
      ];
      const center = centers[clusterId];
      x = center.x + (rng.nextFloat() - 0.5) * 220;
      y = center.y + (rng.nextFloat() - 0.5) * 220;
    } else if (config.distribution === 'radial') {
      const angle = (i / config.customerCount) * 2 * Math.PI + rng.nextFloat() * 0.2;
      const radius = 100 + rng.nextFloat() * 360;
      x = depot.x + Math.cos(angle) * radius;
      y = depot.y + Math.sin(angle) * radius;
    } else if (config.distribution === 'grid') {
      const cols = Math.ceil(Math.sqrt(config.customerCount));
      const step = 800 / cols;
      const col = (i - 1) % cols;
      const row = Math.floor((i - 1) / cols);
      x = 100 + col * step + (rng.nextFloat() - 0.5) * 30;
      y = 100 + row * step + (rng.nextFloat() - 0.5) * 30;
    } else {
      x = 80 + rng.nextFloat() * 840;
      y = 80 + rng.nextFloat() * 840;
    }

    x = Math.max(50, Math.min(950, Math.round(x)));
    y = Math.max(50, Math.min(950, Math.round(y)));

    const demand = Math.floor(2 + rng.nextFloat() * 8);
    const distFromDepot = Math.round(getDistance({ x, y }, depot));

    customers.push({
      id: `C${i < 10 ? '0' + i : i}`,
      name: `Customer Point ${i}`,
      x,
      y,
      demand,
      isDepot: false,
      distanceFromDepot: distFromDepot,
    });
  }

  return { depot, customers };
}

/**
 * Converts UI data types into HGS engine CVRPProblem representation
 */
export function convertToCVRPProblem(
  depot: DepotNode,
  customers: CustomerNode[],
  vehicleCount: number,
  vehicleCapacity: number
): CVRPProblem {
  const hgsCustomers: Customer[] = customers.map((c, index) => ({
    id: index + 1, // 1 to N
    x: c.x,
    y: c.y,
    demand: c.demand,
    label: c.name || c.id,
  }));

  return {
    depot: { x: depot.x, y: depot.y, label: depot.name },
    customers: hgsCustomers,
    vehicleCount,
    vehicleCapacity,
  };
}

/**
 * Converts HGS engine routes back to UI Vehicle and CustomerNode arrays
 */
export function convertHGSRoutesToUIVehicles(
  routes: Route[],
  customers: CustomerNode[],
  vehicleCapacity: number
): { vehicles: Vehicle[]; updatedCustomers: CustomerNode[] } {
  const updatedCustomers = customers.map(c => ({
    ...c,
    assignedVehicleId: undefined as string | undefined,
    visitOrder: undefined as number | undefined,
  }));

  const vehicles: Vehicle[] = [];

  for (let rIdx = 0; rIdx < routes.length; rIdx++) {
    const route = routes[rIdx];
    const vehicleId = `V${rIdx + 1}`;
    const vehicleColor = VEHICLE_COLORS[rIdx % VEHICLE_COLORS.length];

    const routeNodeIds: string[] = [];
    let visitOrder = 1;

    for (const custHgsId of route.customerIds) {
      // custHgsId is 1-indexed into customers array
      const custIndex = custHgsId - 1;
      if (custIndex >= 0 && custIndex < updatedCustomers.length) {
        const cust = updatedCustomers[custIndex];
        cust.assignedVehicleId = vehicleId;
        cust.visitOrder = visitOrder++;
        routeNodeIds.push(cust.id);
      }
    }

    vehicles.push({
      id: vehicleId,
      name: `Vehicle ${rIdx + 1 < 10 ? '0' + (rIdx + 1) : rIdx + 1}`,
      capacity: vehicleCapacity,
      currentLoad: route.load,
      color: vehicleColor,
      routeNodeIds,
      totalDistance: Math.round(route.distance),
    });
  }

  return { vehicles, updatedCustomers };
}

/**
 * Clean descriptor for the Quantum extension point (QARI)
 * No synthetic/fake results.
 */
export function createDeferredQuantumData(): QuantumExecutionData {
  return {
    qubits: 16,
    circuitDepth: 0,
    iterations: 0,
    shots: 0,
    optimizer: 'COBYLA',
    backend: 'ibmq_qasm_simulator',
    status: 'deferred',
    note: 'Quantum-Assisted Route Improvement (QARI) is staged for Phase 2. The real HGS solution is preserved as the exact classical baseline.',
    stateVectorProbabilities: [],
    history: [],
  };
}
