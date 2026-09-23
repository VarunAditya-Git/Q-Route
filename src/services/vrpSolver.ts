import type { 
  CustomerNode, 
  DepotNode, 
  Vehicle, 
  VRPProblemConfig, 
  GenerationPoint, 
  HGSCandidateSolution, 
  QuantumExecutionData 
} from '../types/vrp';

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

// Generate Problem Instance based on configuration
export function generateVRPProblem(config: VRPProblemConfig): { depot: DepotNode; customers: CustomerNode[] } {
  // Determine Depot Position
  let depotX = 500;
  let depotY = 500;

  if (config.depotLocation === 'corner') {
    depotX = 150;
    depotY = 150;
  } else if (config.depotLocation === 'random') {
    depotX = 200 + Math.random() * 600;
    depotY = 200 + Math.random() * 600;
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
      x = center.x + (Math.random() - 0.5) * 220;
      y = center.y + (Math.random() - 0.5) * 220;
    } else if (config.distribution === 'radial') {
      const angle = (i / config.customerCount) * 2 * Math.PI + Math.random() * 0.2;
      const radius = 100 + Math.random() * 360;
      x = depot.x + Math.cos(angle) * radius;
      y = depot.y + Math.sin(angle) * radius;
    } else if (config.distribution === 'grid') {
      const cols = Math.ceil(Math.sqrt(config.customerCount));
      const step = 800 / cols;
      const col = (i - 1) % cols;
      const row = Math.floor((i - 1) / cols);
      x = 100 + col * step + (Math.random() - 0.5) * 30;
      y = 100 + row * step + (Math.random() - 0.5) * 30;
    } else {
      x = 80 + Math.random() * 840;
      y = 80 + Math.random() * 840;
    }

    x = Math.max(50, Math.min(950, Math.round(x)));
    y = Math.max(50, Math.min(950, Math.round(y)));

    const demand = Math.floor(2 + Math.random() * 8);
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

export function createInitialRoutes(
  depot: DepotNode,
  customers: CustomerNode[],
  vehicleCount: number,
  vehicleCapacity: number,
  isOptimized: boolean = false
): { vehicles: Vehicle[]; updatedCustomers: CustomerNode[]; totalDistance: number } {
  const updatedCustomers = customers.map(c => ({ ...c }));
  const unassigned = [...updatedCustomers];

  if (isOptimized) {
    unassigned.sort((a, b) => {
      const angleA = Math.atan2(a.y - depot.y, a.x - depot.x);
      const angleB = Math.atan2(b.y - depot.y, b.x - depot.x);
      return angleA - angleB;
    });
  } else {
    unassigned.sort(() => Math.random() - 0.5);
  }

  const vehicles: Vehicle[] = [];
  let overallTotalDistance = 0;

  for (let v = 0; v < vehicleCount; v++) {
    const vehicleColor = VEHICLE_COLORS[v % VEHICLE_COLORS.length];
    const routeNodeIds: string[] = [];
    let currentLoad = 0;
    let routeDistance = 0;
    let currentPos = { x: depot.x, y: depot.y };

    let visitIndex = 1;

    for (let i = unassigned.length - 1; i >= 0; i--) {
      const cust = unassigned[i];

      if (currentLoad + cust.demand <= vehicleCapacity || routeNodeIds.length === 0) {
        routeNodeIds.push(cust.id);
        currentLoad += cust.demand;

        routeDistance += getDistance(currentPos, cust);
        currentPos = { x: cust.x, y: cust.y };

        const custRef = updatedCustomers.find(c => c.id === cust.id);
        if (custRef) {
          custRef.assignedVehicleId = `V${v + 1}`;
          custRef.visitOrder = visitIndex++;
        }

        unassigned.splice(i, 1);
      }
    }

    if (routeNodeIds.length > 0) {
      routeDistance += getDistance(currentPos, depot);
    }

    const roundedDist = Math.round(routeDistance * 1.2);
    overallTotalDistance += roundedDist;

    vehicles.push({
      id: `V${v + 1}`,
      name: `Vehicle 0${v + 1}`,
      capacity: vehicleCapacity,
      currentLoad,
      color: vehicleColor,
      routeNodeIds,
      totalDistance: roundedDist,
    });
  }

  return {
    vehicles,
    updatedCustomers,
    totalDistance: Math.round(overallTotalDistance),
  };
}

export function generateHGSData(initialDist: number, targetDist: number): {
  history: GenerationPoint[];
  population: HGSCandidateSolution[];
} {
  const history: GenerationPoint[] = [];
  const maxGens = 100;
  let currentBest = initialDist;

  for (let g = 1; g <= maxGens; g++) {
    const decay = Math.exp(-g / 22);
    const noise = (Math.random() - 0.4) * 8;
    currentBest = Math.round(targetDist + (initialDist - targetDist) * decay + noise);
    if (g === maxGens) currentBest = targetDist;

    const avgDist = Math.round(currentBest * (1 + 0.18 * decay));
    const diversity = Math.round(85 * decay + 10);

    history.push({
      generation: g,
      bestDistance: Math.max(targetDist, currentBest),
      avgDistance: Math.max(targetDist + 15, avgDist),
      diversity: Math.max(5, diversity),
    });
  }

  const population: HGSCandidateSolution[] = [
    { id: 'SOL-HGS-01', distance: targetDist, vehicleCount: 5, isBest: true, fitnessScore: 0.98 },
    { id: 'SOL-HGS-02', distance: targetDist + 28, vehicleCount: 5, isBest: false, fitnessScore: 0.94 },
    { id: 'SOL-HGS-03', distance: targetDist + 54, vehicleCount: 5, isBest: false, fitnessScore: 0.89 },
    { id: 'SOL-HGS-04', distance: targetDist + 89, vehicleCount: 6, isBest: false, fitnessScore: 0.81 },
  ];

  return { history, population };
}

export function generateQuantumData(targetDist: number): QuantumExecutionData {
  return {
    qubits: 12,
    circuitDepth: 18,
    iterations: 100,
    shots: 1024,
    optimizer: 'SPSA',
    backend: 'ibmq_qasm_simulator',
    status: 'completed',
    stateVectorProbabilities: [
      { state: '|011010110001⟩', probability: 0.42 },
      { state: '|011010110010⟩', probability: 0.28 },
      { state: '|100101100100⟩', probability: 0.14 },
      { state: '|001100101110⟩', probability: 0.09 },
      { state: '|110010001001⟩', probability: 0.07 },
    ],
    history: Array.from({ length: 50 }, (_, i) => {
      const step = i + 1;
      const decay = Math.exp(-step / 12);
      return {
        generation: step,
        bestDistance: Math.round((targetDist - 14) + 380 * decay + Math.random() * 12),
        avgDistance: Math.round((targetDist + 20) + 420 * decay),
        diversity: Math.round(90 * decay + 8),
      };
    }),
  };
}
