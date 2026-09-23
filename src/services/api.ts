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

export const DEFAULT_CONFIG: VRPProblemConfig = {
  customerCount: 50,
  vehicleCount: 5,
  vehicleCapacity: 40,
  depotLocation: 'center',
  distribution: 'clustered',
  objective: 'distance',
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

  async optimizeQuantum(problemId: string): Promise<OptimizationResult> {
    const current = mockStorage.get(problemId);
    if (!current) throw new Error(`Problem ID ${problemId} not found.`);

    const quantumDistance = Math.round(current.totalDistance * 0.981);

    const updatedResult: OptimizationResult = {
      ...current,
      totalDistance: quantumDistance,
      quantumData: {
        ...current.quantumData,
        status: 'completed',
      },
    };

    mockStorage.set(problemId, updatedResult);
    return updatedResult;
  },

  async getOptimization(id: string): Promise<OptimizationResult | null> {
    return mockStorage.get(id) || null;
  },

  async getOptimizationResults(id: string): Promise<OptimizationResult | null> {
    return mockStorage.get(id) || null;
  }
};
