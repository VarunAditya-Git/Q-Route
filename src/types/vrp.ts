import type { EconomicMetrics, HGSResult, ValidationDetails } from '../services/hgs/types';

export type DistributionType = 'random' | 'clustered' | 'radial' | 'grid';
export type OptimizationObjective = 'distance' | 'cost' | 'vehicles' | 'balanced';

export interface VRPNode {
  id: string;
  name: string;
  x: number; // 0 to 1000 coordinate plane
  y: number; // 0 to 1000 coordinate plane
  demand: number;
  isDepot?: boolean;
}

export interface CustomerNode extends VRPNode {
  isDepot: false;
  assignedVehicleId?: string;
  visitOrder?: number;
  distanceFromDepot: number;
}

export interface DepotNode extends VRPNode {
  isDepot: true;
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  color: string;
  routeNodeIds: string[]; // List of customer IDs visited in order (excluding depot)
  totalDistance: number;
}

export interface VRPProblemConfig {
  seed: number;
  customerCount: number;
  vehicleCount: number;
  vehicleCapacity: number;
  depotLocation: 'center' | 'corner' | 'random';
  distribution: DistributionType;
  objective: OptimizationObjective;
  constraints: {
    visitOnce: boolean;
    capacityCheck: boolean;
    startEndDepot: boolean;
    timeWindows: boolean;
  };
  // Classical HGS Engine Hyperparameters
  hgsParams?: {
    populationSize: number;
    maxGenerations: number;
    mutationRate: number;
    crossoverRate: number;
    localSearchEnabled: boolean;
    twoOptEnabled: boolean;
    relocateEnabled: boolean;
    swapEnabled: boolean;
  };
}

export interface GenerationPoint {
  generation: number;
  bestDistance: number;
  avgDistance: number;
  diversity: number;
  feasibleCount?: number;
}

export interface HGSCandidateSolution {
  id: string;
  distance: number;
  vehicleCount: number;
  isBest?: boolean;
  fitnessScore: number;
}

export interface HGSExecutionData {
  generation: number;
  maxGenerations: number;
  bestDistance: number;
  avgDistance: number;
  diversityScore: number;
  population: HGSCandidateSolution[];
  history: GenerationPoint[];
  status: 'idle' | 'running' | 'completed';
  executionTimeMs?: number;
  bestGeneration?: number;
}

export interface QuantumCircuitGate {
  id: string;
  type: 'H' | 'X' | 'RZ' | 'CNOT' | 'MEASURE';
  qubitTarget: number;
  qubitControl?: number;
  angle?: string;
}

export interface QuantumExecutionData {
  qubits: number;
  circuitDepth: number;
  iterations: number;
  shots: number;
  optimizer: 'SPSA' | 'COBYLA' | 'ADAM';
  backend: 'ibmq_qasm_simulator' | 'ibm_sherbrooke' | 'aer_simulator';
  stateVectorProbabilities: { state: string; probability: number }[];
  history: GenerationPoint[];
  status: 'idle' | 'running' | 'completed' | 'deferred';
  note?: string;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  seed: number;
  isRealHGS: boolean;
  totalDistance: number;
  vehiclesUsed: number;
  totalCustomers: number;
  constraintViolations: number;
  totalDemand: number;
  vehicleCapacity: number;
  executionTimeMs: number;
  depot: DepotNode;
  customers: CustomerNode[];
  vehicles: Vehicle[];
  hgsData: HGSExecutionData;
  quantumData: QuantumExecutionData;
  // Real HGS & Economic Metrics
  hgsRawResult?: HGSResult;
  baselineDistance?: number;
  baselineVehiclesUsed?: number;
  economicMetrics?: EconomicMetrics;
  validationDetails?: ValidationDetails;
  isFeasible?: boolean;
}

export type ActiveTab = 
  | 'overview' 
  | 'setup' 
  | 'map' 
  | 'hgs' 
  | 'quantum' 
  | 'comparison' 
  | 'results' 
  | 'research';
