import { describe, test, expect } from 'vitest';
import type { DepotNode, CustomerNode, VRPProblemConfig } from '../../types/vrp';
import { validateRoutingProblem } from './validator';
import { buildRoutingQUBO } from './quboBuilder';
import { quboToIsing } from './hamiltonianBuilder';
import { buildQAOACircuit } from './circuitBuilder';
import { decodeBitstringToRoute } from './decoder';
import { evaluateRouteFeasibility } from './feasibility';
import { solveQAOARouting } from './qaoaService';

describe('QAOA Routing Optimization Service Unit Tests', () => {
  const mockDepot: DepotNode = {
    id: 'DEPOT',
    name: 'Central Depot',
    x: 500,
    y: 500,
    demand: 0,
    isDepot: true,
  };

  const mockCustomers: CustomerNode[] = [
    { id: 'C01', name: 'Customer 1', x: 200, y: 200, demand: 5, isDepot: false, distanceFromDepot: 424 },
    { id: 'C02', name: 'Customer 2', x: 800, y: 200, demand: 8, isDepot: false, distanceFromDepot: 424 },
    { id: 'C03', name: 'Customer 3', x: 500, y: 800, demand: 6, isDepot: false, distanceFromDepot: 300 },
  ];

  const mockVrpConfig: VRPProblemConfig = {
    customerCount: 3,
    vehicleCount: 2,
    vehicleCapacity: 40,
    depotLocation: 'center',
    distribution: 'clustered',
    objective: 'distance',
    selectedAlgorithm: 'qaoa',
    qaoaSettings: {
      pLayers: 2,
      shots: 512,
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

  test('1. Problem Validation & Distance Matrix', () => {
    const validation = validateRoutingProblem(mockDepot, mockCustomers);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(validation.distanceMatrix).toHaveLength(4); // 1 depot + 3 customers
    expect(validation.distanceMatrix[0][0]).toBe(0);
  });

  test('2. QUBO Formulation Builder', () => {
    const qubo = buildRoutingQUBO(mockDepot, mockCustomers, 500, 500);
    // N = 3 customers -> N^2 = 9 binary variables
    expect(qubo.numVariables).toBe(9);
    expect(qubo.matrix).toHaveLength(9);
    expect(qubo.variableNames).toHaveLength(9);
    expect(qubo.matrix[0][0]).toBeDefined();
  });

  test('3. Ising Hamiltonian Conversion', () => {
    const qubo = buildRoutingQUBO(mockDepot, mockCustomers, 500, 500);
    const ising = quboToIsing(qubo);
    expect(ising.numQubits).toBe(9);
    expect(ising.linearTerms).toHaveLength(9);
    expect(ising.pauliZZTerms.length).toBeGreaterThan(0);
  });

  test('4. QAOA Circuit Generator for p layers', () => {
    const qubo = buildRoutingQUBO(mockDepot, mockCustomers, 500, 500);
    const ising = quboToIsing(qubo);
    const pLayers = 3;
    const gammas = [0.1, 0.2, 0.3];
    const betas = [0.4, 0.5, 0.6];

    const circuit = buildQAOACircuit(ising, gammas, betas);
    expect(circuit.numQubits).toBe(9);
    expect(circuit.pLayers).toBe(pLayers);
    expect(circuit.instructions.length).toBeGreaterThan(0);
    expect(circuit.instructions.some(i => i.type === 'H')).toBe(true);
    expect(circuit.instructions.some(i => i.type === 'MEASURE')).toBe(true);
  });

  test('5. Bitstring Decoder & Feasibility Evaluator', () => {
    // Valid bitstring for 3 customers: x_{0,0}=1, x_{1,1}=1, x_{2,2}=1 -> "100010001"
    const validBitstring = '100010001';
    const decodedValid = decodeBitstringToRoute(validBitstring, mockCustomers);
    const feasibilityValid = evaluateRouteFeasibility(decodedValid, mockCustomers);

    expect(feasibilityValid.isFeasible).toBe(true);
    expect(feasibilityValid.reconstructedRouteIds).toHaveLength(3);

    // Invalid bitstring with collision (multiple cities at position 0): "100100000"
    const invalidBitstring = '100100000';
    const decodedInvalid = decodeBitstringToRoute(invalidBitstring, mockCustomers);
    const feasibilityInvalid = evaluateRouteFeasibility(decodedInvalid, mockCustomers);

    expect(feasibilityInvalid.isFeasible).toBe(false);
    expect(feasibilityInvalid.wasRepaired).toBe(true);
    expect(feasibilityInvalid.reconstructedRouteIds).toHaveLength(3); // Repair recovers all 3 nodes
  });

  test('6. End-to-End QAOA Solver Execution', async () => {
    const result = await solveQAOARouting(mockDepot, mockCustomers, mockVrpConfig, {
      pLayers: 2,
      shots: 256,
      optimizer: 'SPSA',
      backend: 'statevector',
      penaltyA: 500,
      penaltyB: 500,
      maxIterations: 10,
    });

    expect(result.algorithm).toBe('QAOA');
    expect(result.status).toBe('completed');
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.totalDistance).toBeGreaterThan(0);
    expect(result.measurementDistribution.length).toBeGreaterThan(0);
    expect(result.qubits).toBe(9);
    expect(result.bestBitstring).toBeDefined();
  });
});
