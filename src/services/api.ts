import type { 
  VRPProblemConfig, 
  OptimizationResult 
} from '../types/vrp';
import { 
  generateVRPProblem, 
  createInitialRoutes, 
  generateHGSData, 
  generateQuantumData 
} from './vrpSolver';
import { solveQAOARouting, DEFAULT_QAOA_CONFIG, type QAOAConfig } from './qaoa';

export const DEFAULT_CONFIG: VRPProblemConfig = {
  customerCount: 50,
  vehicleCount: 5,
  vehicleCapacity: 40,
  depotLocation: 'center',
  distribution: 'clustered',
  objective: 'distance',
  selectedAlgorithm: 'qaoa',
  qaoaSettings: {
    pLayers: 2,
    shots: 1024,
    optimizer: 'SPSA',
    backend: 'statevector',
    penaltyA: 500,
    penaltyB: 500,
  },
  constraints: {
    visitOnce: true,
    capacityCheck: true,
    startEndDepot: true,
    timeWindows: false,
  },
};

const mockStorage: Map<string, OptimizationResult> = new Map();

export const QRouteAPI = {
  async generateProblem(config: VRPProblemConfig = DEFAULT_CONFIG): Promise<OptimizationResult> {
    const { depot, customers } = generateVRPProblem(config);
    const { vehicles, updatedCustomers, totalDistance } = createInitialRoutes(
      depot,
      customers,
      config.vehicleCount,
      config.vehicleCapacity,
      false
    );

    const totalDemand = customers.reduce((acc, c) => acc + c.demand, 0);
    const initialDist = Math.round(totalDistance * 1.35);
    const bestTargetDist = Math.round(totalDistance * 0.75);

    const { history, population } = generateHGSData(initialDist, bestTargetDist);
    const quantumData = generateQuantumData(bestTargetDist - 14);

    const result: OptimizationResult = {
      id: `OPT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      totalDistance: initialDist,
      vehiclesUsed: config.vehicleCount,
      totalCustomers: config.customerCount,
      constraintViolations: 0,
      totalDemand,
      vehicleCapacity: config.vehicleCapacity,
      executionTimeMs: 2840,
      depot,
      customers: updatedCustomers,
      vehicles,
      algorithmUsed: config.selectedAlgorithm || 'hgs',
      hgsData: {
        generation: 1,
        maxGenerations: 100,
        bestDistance: initialDist,
        avgDistance: Math.round(initialDist * 1.15),
        diversityScore: 88,
        population,
        history,
        status: 'idle',
      },
      quantumData: {
        ...quantumData,
        status: 'idle',
      },
    };

    mockStorage.set(result.id, result);
    return result;
  },

  async optimizeHGS(problemId: string): Promise<OptimizationResult> {
    const current = mockStorage.get(problemId);
    if (!current) throw new Error(`Problem ID ${problemId} not found.`);

    const { vehicles, updatedCustomers, totalDistance } = createInitialRoutes(
      current.depot,
      current.customers,
      current.vehiclesUsed,
      current.vehicleCapacity,
      true
    );

    const updatedResult: OptimizationResult = {
      ...current,
      totalDistance,
      customers: updatedCustomers,
      vehicles,
      algorithmUsed: 'hgs',
      hgsData: {
        ...current.hgsData,
        generation: 100,
        bestDistance: totalDistance,
        status: 'completed',
      },
    };

    mockStorage.set(problemId, updatedResult);
    return updatedResult;
  },

  async optimizeQAOA(
    problemId: string,
    qaoaConfig?: Partial<QAOAConfig>,
    vrpConfig: VRPProblemConfig = DEFAULT_CONFIG
  ): Promise<OptimizationResult> {
    const current = mockStorage.get(problemId);
    if (!current) throw new Error(`Problem ID ${problemId} not found.`);

    const fullQAOAConfig: QAOAConfig = {
      ...DEFAULT_QAOA_CONFIG,
      ...vrpConfig.qaoaSettings,
      ...qaoaConfig,
    };

    const qaoaResult = await solveQAOARouting(
      current.depot,
      current.customers,
      vrpConfig,
      fullQAOAConfig
    );

    const updatedResult: OptimizationResult = {
      ...current,
      totalDistance: qaoaResult.totalDistance,
      customers: current.customers,
      vehicles: qaoaResult.vehicles,
      constraintViolations: qaoaResult.constraintViolations,
      executionTimeMs: qaoaResult.runtimeMs,
      algorithmUsed: 'qaoa',
      quantumData: {
        qubits: qaoaResult.qubits,
        circuitDepth: qaoaResult.qaoaDepth * 8,
        iterations: qaoaResult.history.length,
        shots: qaoaResult.shots,
        optimizer: fullQAOAConfig.optimizer,
        backend: fullQAOAConfig.backend,
        status: 'completed',
        feasible: qaoaResult.feasible,
        bestBitstring: qaoaResult.bestBitstring,
        pLayers: qaoaResult.qaoaDepth,
        executionMode: qaoaResult.executionMode,
        qaoaResult,
        stateVectorProbabilities: qaoaResult.measurementDistribution.map(d => ({
          state: d.state,
          probability: d.probability,
          feasible: d.feasible,
          energy: d.energy,
        })),
        history: qaoaResult.history.map(h => ({
          generation: h.generation,
          bestDistance: h.bestDistance,
          avgDistance: h.avgDistance,
          diversity: h.diversity,
        })),
      },
    };

    mockStorage.set(problemId, updatedResult);
    return updatedResult;
  },

  async optimizeQuantum(problemId: string): Promise<OptimizationResult> {
    return this.optimizeQAOA(problemId);
  },

  async getOptimization(id: string): Promise<OptimizationResult | null> {
    return mockStorage.get(id) || null;
  },

  async getOptimizationResults(id: string): Promise<OptimizationResult | null> {
    return mockStorage.get(id) || null;
  }
};
