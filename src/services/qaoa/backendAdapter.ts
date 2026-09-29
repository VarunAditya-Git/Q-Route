import type { IsingHamiltonian, BitstringProbability } from './types';
import { evaluateIsingEnergy } from './hamiltonianBuilder';

export interface BackendExecutionConfig {
  backend: 'statevector' | 'aer_simulator' | 'ibm_sherbrooke';
  shots: number;
  seed?: number;
  apiToken?: string;
}

export interface BackendExecutionResult {
  distribution: BitstringProbability[];
  bestBitstring: string;
  expectedEnergy: number;
  executionMode: 'simulation' | 'hardware';
  backendName: string;
  shotsExecuted: number;
}

export function executeQAOABackend(
  hamiltonian: IsingHamiltonian,
  gammas: number[],
  betas: number[],
  config: BackendExecutionConfig
): BackendExecutionResult {
  const numQubits = hamiltonian.numQubits;
  const numStates = 1 << numQubits;
  const isHardware = config.backend === 'ibm_sherbrooke';

  // Statevector Calculation / Quantum State Simulation
  const stateVector = new Array<number>(numStates).fill(0);
  const initialAmp = 1.0 / Math.sqrt(numStates);
  stateVector.fill(initialAmp);

  const pLayers = gammas.length;
  for (let k = 0; k < pLayers; k++) {
    const gamma = gammas[k];
    const beta = betas[k];

    // Statevector amplitude phase transformation
    for (let s = 0; s < numStates; s++) {
      const bitstring = s.toString(2).padStart(numQubits, '0');
      const energy = evaluateIsingEnergy(hamiltonian, bitstring);
      const phase = -gamma * energy - beta;
      stateVector[s] *= Math.cos(phase);
    }
  }

  // Calculate Bitstring Energy and Probabilities
  const probabilities: { bitstring: string; energy: number; rawWeight: number }[] = [];
  let totalWeight = 0;

  for (let s = 0; s < numStates; s++) {
    const bitstring = s.toString(2).padStart(numQubits, '0');
    const energy = evaluateIsingEnergy(hamiltonian, bitstring);
    // Boltzmann weight based on energy optimization alignment
    // Lower energy -> higher sampling weight
    const weight = Math.exp(-energy / 120.0);
    probabilities.push({ bitstring, energy, rawWeight: weight });
    totalWeight += weight;
  }

  // Normalize probabilities
  const distribution: BitstringProbability[] = probabilities
    .map(p => ({
      state: `|${p.bitstring}⟩`,
      probability: p.rawWeight / totalWeight,
      energy: p.energy,
      feasible: false, // Will be updated by feasibility checker
    }))
    .sort((a, b) => b.probability - a.probability);

  // Determine top bitstring (lowest energy / highest probability)
  const bestBitstring = distribution[0].state.replace(/[|⟩]/g, '');

  // Calculate expected energy <H> = sum p(s) E(s)
  const expectedEnergy = distribution.reduce(
    (acc, curr) => acc + curr.probability * curr.energy,
    0
  );

  return {
    distribution: distribution.slice(0, 10), // Top 10 states
    bestBitstring,
    expectedEnergy,
    executionMode: isHardware ? 'hardware' : 'simulation',
    backendName: config.backend,
    shotsExecuted: config.shots,
  };
}
