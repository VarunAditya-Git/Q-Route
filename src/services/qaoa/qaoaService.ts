import type { CustomerNode, DepotNode, VRPProblemConfig } from '../../types/vrp';
import type { QAOAConfig, QAOARoutingResult } from './types';
import { validateRoutingProblem } from './validator';
import { buildRoutingQUBO } from './quboBuilder';
import { quboToIsing } from './hamiltonianBuilder';
import { optimizeQAOAParameters } from './optimizer';
import { decodeBitstringToRoute } from './decoder';
import { evaluateRouteFeasibility } from './feasibility';
import { reconstructVehicles } from './routeReconstruction';

export const DEFAULT_QAOA_CONFIG: QAOAConfig = {
  pLayers: 2,
  shots: 1024,
  optimizer: 'SPSA',
  backend: 'statevector',
  penaltyA: 500,
  penaltyB: 500,
  maxIterations: 50,
};

export async function solveQAOARouting(
  depot: DepotNode,
  customers: CustomerNode[],
  config: VRPProblemConfig,
  qaoaConfig: QAOAConfig = DEFAULT_QAOA_CONFIG
): Promise<QAOARoutingResult> {
  const startTime = performance.now();

  // Stage 1 & 2: Problem Validation & Routing Matrix
  const validation = validateRoutingProblem(depot, customers);
  if (!validation.isValid) {
    throw new Error(`QAOA Routing Problem Validation Failed: ${validation.errors.join(', ')}`);
  }

  // Stage 3 & 4: QUBO Matrix Construction
  // For QAOA optimization, we select up to 5 key customer nodes for exact quantum encoding
  const targetCustomers = customers.slice(0, Math.min(5, customers.length));
  const quboFormulation = buildRoutingQUBO(
    depot,
    targetCustomers,
    qaoaConfig.penaltyA,
    qaoaConfig.penaltyB
  );

  // Stage 5: Ising Spin Hamiltonian Builder
  const hamiltonian = quboToIsing(quboFormulation);

  // Stage 6, 7 & 8: Classical Parameter Optimization & Quantum Backend Execution
  const optimization = optimizeQAOAParameters(hamiltonian, qaoaConfig);
  const { history, backendResult, bestGammas, bestBetas } = optimization;

  // Stage 9 & 10: Measurement Bitstring Decoding
  const decoded = decodeBitstringToRoute(backendResult.bestBitstring, targetCustomers);

  // Stage 11: Feasibility Assessment & Repair Strategy
  const feasibility = evaluateRouteFeasibility(decoded, targetCustomers);

  // Map repaired route back to full customer set if problem size > 5
  let fullRouteCustomerIds = [...feasibility.reconstructedRouteIds];
  if (customers.length > targetCustomers.length) {
    const assignedSet = new Set(fullRouteCustomerIds);
    for (const cust of customers) {
      if (!assignedSet.has(cust.id)) {
        fullRouteCustomerIds.push(cust.id);
      }
    }
  }

  // Stage 12: Route & Vehicle Reconstruction
  const { vehicles, totalDistance } = reconstructVehicles(
    fullRouteCustomerIds,
    depot,
    customers,
    config.vehicleCount,
    config.vehicleCapacity
  );

  const endTime = performance.now();

  // Mark feasibility on sampling distribution items
  const evaluatedDistribution = backendResult.distribution.map(item => {
    const rawBs = item.state.replace(/[|⟩]/g, '');
    const dec = decodeBitstringToRoute(rawBs, targetCustomers);
    const feas = evaluateRouteFeasibility(dec, targetCustomers);
    return {
      ...item,
      feasible: feas.isFeasible,
      routeCost: Math.round(item.energy),
    };
  });

  return {
    id: `OPT-QAOA-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toISOString(),
    algorithm: 'QAOA',
    problemType: 'TSP_VRP_SUBPROBLEM',
    status: 'completed',
    feasible: feasibility.isFeasible,
    constraintViolations: feasibility.violationCount,
    routeCustomerIds: fullRouteCustomerIds,
    vehicles,
    totalDistance,
    objectiveValue: optimization.minEnergy,
    qaoaDepth: qaoaConfig.pLayers,
    parameters: {
      gammas: bestGammas,
      betas: bestBetas,
    },
    shots: qaoaConfig.shots,
    backend: qaoaConfig.backend,
    executionMode: backendResult.executionMode,
    measurementDistribution: evaluatedDistribution,
    bestBitstring: backendResult.bestBitstring,
    runtimeMs: Math.round(endTime - startTime),
    qubits: hamiltonian.numQubits,
    quboFormulation,
    history,
  };
}
