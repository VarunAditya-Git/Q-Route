# Troubleshooting Guide

This guide covers common issues, error messages, and penalty tuning recommendations for the QAOA service.

---

## 1. High Infeasible Bitstring Rate

### Symptom
Top measured bitstrings yield position collisions or unvisited cities.

### Solution
- Increase penalty coefficient `penaltyA` and `penaltyB` in Problem Setup (e.g. set from 500 to 1000).
- Increase measurement shots from 1024 to 2048.
- The built-in `feasibility.ts` module automatically applies repair heuristics to guarantee a valid route output.

---

## 2. Slow Convergence / Flat Energy Landscape

### Symptom
Expected energy $\langle H_C \rangle$ does not decrease across iterations.

### Solution
- Switch classical optimizer to `SPSA` (Stochastic Perturbation Stochastic Approximation), which handles noisy function evaluations better than COBYLA.
- Increase QAOA layers $p$ from 1 to 2 or 3.

---

## 3. High Memory Usage on Statevector Simulation

### Symptom
Browser slows down during QAOA execution.

### Solution
- Statevector simulation requires $2^M$ floating point numbers. Keep sub-instance size $N \le 5$ (which requires $M = 25$ qubits in statevector).
- For larger instances, use `aer_simulator` (shot-based sampling) or IBM remote backend.
