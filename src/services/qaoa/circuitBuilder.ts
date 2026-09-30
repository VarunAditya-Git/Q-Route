import type { IsingHamiltonian, QAOACircuitSpec, QAOAInstruction } from './types';

export function buildQAOACircuit(
  hamiltonian: IsingHamiltonian,
  gammas: number[],
  betas: number[]
): QAOACircuitSpec {
  const p = gammas.length;
  const numQubits = hamiltonian.numQubits;
  const instructions: QAOAInstruction[] = [];

  // 1. Initial State Preparation: Hadamard on all qubits
  for (let q = 0; q < numQubits; q++) {
    instructions.push({ type: 'H', target: q, label: 'Superposition' });
  }

  // 2. Apply QAOA layers
  for (let k = 0; k < p; k++) {
    const gamma = gammas[k];
    const beta = betas[k];

    // Cost Hamiltonian Unitary e^{-i \gamma_k H_C}
    // Single Z_i terms -> RZ(2 * gamma * h_i)
    for (let q = 0; q < numQubits; q++) {
      const h_i = hamiltonian.linearTerms[q];
      if (Math.abs(h_i) > 1e-6) {
        instructions.push({
          type: 'RZ',
          target: q,
          angle: 2 * gamma * h_i,
          label: `Cost Z_${q}`,
        });
      }
    }

    // Pair Z_i Z_j terms -> CNOT(i, j) -> RZ(2 * gamma * J_{ij}) -> CNOT(i, j)
    for (const term of hamiltonian.pauliZZTerms) {
      if (Math.abs(term.weight) > 1e-6) {
        instructions.push({ type: 'CNOT', control: term.i, target: term.j, label: 'ZZ entangle' });
        instructions.push({
          type: 'RZ',
          target: term.j,
          angle: 2 * gamma * term.weight,
          label: `Cost ZZ_${term.i}_${term.j}`,
        });
        instructions.push({ type: 'CNOT', control: term.i, target: term.j, label: 'ZZ entangle' });
      }
    }

    // Mixer Hamiltonian Unitary e^{-i \beta_k H_M} where H_M = \sum X_i -> RX(2 * beta)
    for (let q = 0; q < numQubits; q++) {
      instructions.push({
        type: 'RX',
        target: q,
        angle: 2 * beta,
        label: `Mixer X_${q}`,
      });
    }
  }

  // 3. Measurement gate on all qubits
  for (let q = 0; q < numQubits; q++) {
    instructions.push({ type: 'MEASURE', target: q, label: 'Readout' });
  }

  return {
    numQubits,
    pLayers: p,
    gammas,
    betas,
    instructions,
  };
}
