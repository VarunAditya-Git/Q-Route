import type { QUBOFormulation, IsingHamiltonian, PauliZZTerm } from './types';

export function quboToIsing(qubo: QUBOFormulation): IsingHamiltonian {
  const M = qubo.numVariables;
  const Q = qubo.matrix;

  const linearTerms: number[] = Array(M).fill(0);
  const pauliZZTerms: PauliZZTerm[] = [];
  let isingConstant = qubo.constant;

  // 1. Calculate J_{ij} for pair terms Z_i Z_j
  for (let i = 0; i < M; i++) {
    for (let j = i + 1; j < M; j++) {
      const qVal = (Q[i][j] + Q[j][i]) / 2; // Symmetric component
      if (Math.abs(qVal) > 1e-8) {
        const J_ij = qVal / 4;
        pauliZZTerms.push({ i, j, weight: J_ij });
        
        // Contribution to linear and constant terms from x_i x_j = (1 - Z_i - Z_j + Z_i Z_j)/4
        linearTerms[i] -= qVal / 4;
        linearTerms[j] -= qVal / 4;
        isingConstant += qVal / 4;
      }
    }
  }

  // 2. Calculate h_i for linear terms Z_i
  for (let i = 0; i < M; i++) {
    const qDiagonal = Q[i][i];
    if (Math.abs(qDiagonal) > 1e-8) {
      // Contribution from x_i = (1 - Z_i)/2
      linearTerms[i] -= qDiagonal / 2;
      isingConstant += qDiagonal / 2;
    }
  }

  return {
    numQubits: M,
    linearTerms,
    pauliZZTerms,
    constant: isingConstant,
  };
}

export function evaluateIsingEnergy(hamiltonian: IsingHamiltonian, bitstring: string): number {
  const M = hamiltonian.numQubits;
  // Convert bitstring character '0' -> +1, '1' -> -1 (standard Pauli Z basis)
  const zValues = Array.from(bitstring).map(b => (b === '0' ? 1 : -1));

  let energy = hamiltonian.constant;

  for (let i = 0; i < M; i++) {
    energy += hamiltonian.linearTerms[i] * zValues[i];
  }

  for (const term of hamiltonian.pauliZZTerms) {
    energy += term.weight * zValues[term.i] * zValues[term.j];
  }

  return energy;
}
