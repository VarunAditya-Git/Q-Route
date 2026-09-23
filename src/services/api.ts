import type { 
  VRPProblemConfig, 
  OptimizationResult 
} from '../types/vrp';
import { 
  generateVRPProblem, 
  convertToCVRPProblem, 
  convertHGSRoutesToUIVehicles, 
  createDeferredQuantumData 
} from './vrpSolver';
import { 
  runHGSAsync, 
  generateBaselineSolution, 
  DistanceMatrix, 
  calculateEconomics, 
  validateSolution 
} from './hgs';
import type { CVRPSolution, CVRPProblem } from './hgs/types';

export const DEFAULT_CONFIG: VRPProblemConfig = {
  seed: 42,
  customerCount: 30,
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
  hgsParams: {
    populationSize: 50,
    maxGenerations: 100,
    mutationRate: 0.25,
    crossoverRate: 0.9,
    localSearchEnabled: true,
    twoOptEnabled: true,
    relocateEnabled: true,
    swapEnabled: true,
  },
};

interface ProblemSession {
  result: OptimizationResult;
  cvrpProblem: CVRPProblem;
  baselineSolution: CVRPSolution;
  distanceMatrix: DistanceMatrix;
  config: VRPProblemConfig;
}

const sessionStorage: Map<string, ProblemSession> = new Map();

export const QRouteAPI = {
  /**
   * Generates a deterministic CVRP problem instance and computes the real baseline solution.
   */
  async generateProblem(config: VRPProblemConfig = DEFAULT_CONFIG): Promise<OptimizationResult> {
    const { depot, customers } = generateVRPProblem(config);
    const cvrpProblem = convertToCVRPProblem(
      depot,
      customers,
      config.vehicleCount,
      config.vehicleCapacity
    );
    const distanceMatrix = new DistanceMatrix(cvrpProblem);

    // Compute REAL classical baseline (Nearest-Neighbor with capacity enforcement)
    const baselineSolution = generateBaselineSolution(cvrpProblem, distanceMatrix);
    const { vehicles, updatedCustomers } = convertHGSRoutesToUIVehicles(
      baselineSolution.routes,
      customers,
      config.vehicleCapacity
    );

    const totalDemand = customers.reduce((acc, c) => acc + c.demand, 0);
    const baselineDistRounded = Math.round(baselineSolution.totalDistance);

    const problemId = `OPT-${config.seed || 42}-${Date.now().toString().slice(-4)}`;

    const result: OptimizationResult = {
      id: problemId,
      timestamp: new Date().toISOString(),
      seed: config.seed ?? 42,
      isRealHGS: true,
      totalDistance: baselineDistRounded,
      vehiclesUsed: baselineSolution.vehiclesUsed,
      totalCustomers: config.customerCount,
      constraintViolations: baselineSolution.validation.totalViolationScore > 0 ? 1 : 0,
      totalDemand,
      vehicleCapacity: config.vehicleCapacity,
      executionTimeMs: 0,
      depot,
      customers: updatedCustomers,
      vehicles,
      hgsData: {
        generation: 0,
        maxGenerations: config.hgsParams?.maxGenerations || 100,
        bestDistance: baselineDistRounded,
        avgDistance: baselineDistRounded,
        diversityScore: 100,
        population: [],
        history: [{
          generation: 0,
          bestDistance: baselineDistRounded,
          avgDistance: baselineDistRounded,
          diversity: 100,
        }],
        status: 'idle',
      },
      quantumData: createDeferredQuantumData(),
      baselineDistance: baselineDistRounded,
      baselineVehiclesUsed: baselineSolution.vehiclesUsed,
      isFeasible: baselineSolution.feasible,
      validationDetails: baselineSolution.validation.violations,
    };

    sessionStorage.set(problemId, {
      result,
      cvrpProblem,
      baselineSolution,
      distanceMatrix,
      config,
    });

    return result;
  },

  /**
   * Executes the real Hybrid Genetic Search (HGS-CVRP) engine asynchronously.
   */
  async optimizeHGS(
    problemId: string,
    onProgress?: (progress: { generation: number; currentBest: CVRPSolution; percent: number }) => void
  ): Promise<OptimizationResult> {
    const session = sessionStorage.get(problemId);
    if (!session) {
      throw new Error(`Problem session ${problemId} not found.`);
    }

    const { cvrpProblem, baselineSolution, config } = session;

    // Run real HGS optimization
    const hgsResult = await runHGSAsync(
      cvrpProblem,
      {
        seed: config.seed ?? 42,
        populationSize: config.hgsParams?.populationSize ?? 50,
        maxGenerations: config.hgsParams?.maxGenerations ?? 100,
        mutationRate: config.hgsParams?.mutationRate ?? 0.25,
        crossoverRate: config.hgsParams?.crossoverRate ?? 0.9,
        localSearchEnabled: config.hgsParams?.localSearchEnabled ?? true,
        twoOptEnabled: config.hgsParams?.twoOptEnabled ?? true,
        relocateEnabled: config.hgsParams?.relocateEnabled ?? true,
        swapEnabled: config.hgsParams?.swapEnabled ?? true,
      },
      onProgress
    );

    // Convert optimized routes to UI vehicles and customer updates
    const { vehicles, updatedCustomers } = convertHGSRoutesToUIVehicles(
      hgsResult.bestSolution.routes,
      session.result.customers,
      cvrpProblem.vehicleCapacity
    );

    // Calculate real operational economics
    const economics = calculateEconomics(baselineSolution, hgsResult.bestSolution);

    // Map convergence history to UI GenerationPoint format
    const history = hgsResult.convergenceHistory.map(g => ({
      generation: g.generation,
      bestDistance: Math.round(g.bestDistance),
      avgDistance: Math.round(g.averageDistance),
      diversity: Math.round(g.populationDiversity * 100),
      feasibleCount: g.feasibleSolutions,
    }));

    // Map population summary
    const population = hgsResult.populationSummary.map(p => ({
      id: p.id,
      distance: Math.round(p.distance),
      vehicleCount: p.vehiclesUsed,
      isBest: p.isBest,
      fitnessScore: Number((1 / (1 + p.distance / 1000)).toFixed(3)),
    }));

    const val = validateSolution(hgsResult.bestSolution, cvrpProblem);

    const updatedResult: OptimizationResult = {
      ...session.result,
      totalDistance: Math.round(hgsResult.bestSolution.totalDistance),
      vehiclesUsed: hgsResult.bestSolution.vehiclesUsed,
      constraintViolations: val.totalViolationScore > 0 ? 1 : 0,
      executionTimeMs: hgsResult.executionTimeMs,
      customers: updatedCustomers,
      vehicles,
      hgsData: {
        generation: hgsResult.totalGenerations,
        maxGenerations: config.hgsParams?.maxGenerations || 100,
        bestDistance: Math.round(hgsResult.bestSolution.totalDistance),
        avgDistance: Math.round(hgsResult.convergenceHistory[hgsResult.convergenceHistory.length - 1]?.averageDistance || hgsResult.bestSolution.totalDistance),
        diversityScore: Math.round((hgsResult.convergenceHistory[hgsResult.convergenceHistory.length - 1]?.populationDiversity || 0) * 100),
        population,
        history,
        status: 'completed',
        executionTimeMs: hgsResult.executionTimeMs,
        bestGeneration: hgsResult.bestGeneration,
      },
      hgsRawResult: hgsResult,
      economicMetrics: economics,
      baselineDistance: Math.round(baselineSolution.totalDistance),
      baselineVehiclesUsed: baselineSolution.vehiclesUsed,
      isFeasible: val.feasible,
      validationDetails: val.violations,
    };

    session.result = updatedResult;
    return updatedResult;
  },

  /**
   * Honest handler for Quantum Optimization tab in Classical Phase:
   * Communicates deferred status clearly without fake numbers.
   */
  async optimizeQuantum(problemId: string): Promise<OptimizationResult> {
    const session = sessionStorage.get(problemId);
    if (!session) throw new Error(`Problem session ${problemId} not found.`);

    // Maintain real HGS solution without fake quantum modification
    const updatedResult: OptimizationResult = {
      ...session.result,
      quantumData: {
        ...session.result.quantumData,
        status: 'deferred',
        note: 'Quantum backend is staged for Phase 2 (QARI). The classical HGS solution is the exact verified benchmark.',
      },
    };

    session.result = updatedResult;
    return updatedResult;
  },

  async getOptimization(id: string): Promise<OptimizationResult | null> {
    return sessionStorage.get(id)?.result || null;
  },

  async getOptimizationResults(id: string): Promise<OptimizationResult | null> {
    return sessionStorage.get(id)?.result || null;
  }
};
