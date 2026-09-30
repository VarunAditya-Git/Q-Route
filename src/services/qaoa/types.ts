import type { Vehicle } from '../../types/vrp';

export interface QAOAConfig {
  pLayers: number;            // Number of QAOA layers p (default: 2)
  shots: number;              // Number of measurement shots (default: 1024)
  optimizer: 'COBYLA' | 'SPSA' | 'ADAM';
  backend: 'statevector' | 'aer_simulator' | 'ibm_sherbrooke';
  seed?: number;
  penaltyA: number;           // Penalty for position/node uniqueness (e.g. 1000)
  penaltyB: number;           // Penalty for route continuity / constraints
  maxIterations?: number;
  apiToken?: string;
}

export interface QUBOTerm {
  row: number;
  col: number;
  weight: number;
}

export interface QUBOFormulation {
  numVariables: number;
  matrix: number[][];
  constant: number;
  variableNames: string[];
}

export interface PauliZZTerm {
  i: number;
  j: number;
  weight: number;
}

export interface IsingHamiltonian {
  numQubits: number;
  linearTerms: number[];      // Coeff for Z_i
  pauliZZTerms: PauliZZTerm[]; // Coeff for Z_i Z_j
  constant: number;
}

export interface QAOAInstruction {
  type: 'H' | 'RZ' | 'RX' | 'CNOT' | 'MEASURE';
  target: number;
  control?: number;
  angle?: number;
  label?: string;
}

export interface QAOACircuitSpec {
  numQubits: number;
  pLayers: number;
  gammas: number[];
  betas: number[];
  instructions: QAOAInstruction[];
}

export interface OptimizationIterationPoint {
  generation: number;
  bestDistance: number;
  avgDistance: number;
  diversity: number;
  energy: number;
  gamma: number[];
  beta: number[];
}

export interface BitstringProbability {
  state: string;
  probability: number;
  energy: number;
  feasible: boolean;
  routeCost?: number;
}

export interface QAOARoutingResult {
  id: string;
  timestamp: string;
  algorithm: 'QAOA';
  problemType: 'TSP_VRP_SUBPROBLEM';
  status: 'completed' | 'failed';
  feasible: boolean;
  constraintViolations: number;
  routeCustomerIds: string[];
  vehicles: Vehicle[];
  totalDistance: number;
  objectiveValue: number;
  qaoaDepth: number;
  parameters: {
    gammas: number[];
    betas: number[];
  };
  shots: number;
  backend: string;
  executionMode: 'simulation' | 'hardware';
  measurementDistribution: BitstringProbability[];
  bestBitstring: string;
  runtimeMs: number;
  qubits: number;
  quboFormulation: QUBOFormulation;
  history: OptimizationIterationPoint[];
}
