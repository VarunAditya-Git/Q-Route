# Hardware Realism & Hardware Execution

This document details hardware execution capabilities, simulator modes, telemetry reporting, and hardware honesty guidelines.

---

## 1. Distinction Between Execution Modes

Q-Route explicitly distinguishes between three execution environments:

1. **Statevector Simulator**: Exact state vector calculation without sampling noise.
2. **Shot-based Aer Simulator**: Realistic quantum sampling noise with configurable measurement shots.
3. **Hardware Execution (IBM Quantum)**: Direct execution on physical superconducting quantum processing units (QPUs).

---

## 2. Hardware Telemetry & Reporting

When executing on quantum hardware or simulators, the UI and API report full execution metadata:

- **Backend Name**: e.g., `ibm_sherbrooke` or `statevector`
- **Total Qubits**: Total qubits utilized by the QUBO matrix
- **Circuit Depth**: Total quantum gates in the ansatz
- **Shots**: Total measurement executions
- **Execution Mode**: `simulation` vs `hardware`
- **Measured Probability Distribution**: Top measured bitstrings with feasibility flags
- **Runtime**: Execution latency in milliseconds

---

## 3. Honesty Principle (No Unsubstantiated Claims)

QAOA is an active research algorithm in the NISQ (Noisy Intermediate-Scale Quantum) era. **Q-Route does not claim quantum speedup or quantum advantage.** Results are presented transparently alongside classical baseline metrics for empirical comparison.
