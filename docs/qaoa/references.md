# Research Literature & References

This document lists foundational research papers, formulations, and literature that inform the Q-Route QAOA implementation.

---

## 1. Foundational QAOA & QUBO Papers

### Farhi, E., Goldstone, J., & Gutmann, S. (2014)
* **Title**: A Quantum Approximate Optimization Algorithm
* **Identifier**: [arXiv:1411.4028](https://arxiv.org/abs/1411.4028)
* **Contribution**: Introduces the QAOA framework, mixing Hamiltonians $H_M = \sum X_i$, cost Hamiltonians $H_C$, and parameterized quantum circuits $U(\gamma, \beta)$.
* **Influence on Q-Route**: Formulates the circuit ansatz generator (`circuitBuilder.ts`) and classical optimization loop (`optimizer.ts`).

### Lucas, A. (2014)
* **Title**: Ising formulations of many NP problems
* **Identifier**: [DOI: 10.3389/fphy.2014.00005](https://doi.org/10.3389/fphy.2014.00005) / [arXiv:1302.5843](https://arxiv.org/abs/1302.5843)
* **Contribution**: Establishes standard QUBO and Ising penalty terms for Travelling Salesperson Problems (TSP), graph coloring, and knapsack problems.
* **Influence on Q-Route**: Provides Penalty A (city uniqueness) and Penalty B (position uniqueness) formulations used in `quboBuilder.ts`.

---

## 2. Quantum Vehicle Routing Literature

### Feld, S., et al. (2019)
* **Title**: A Hybrid Solution Method for the Capacitated Vehicle Routing Problem Using a Quantum Annealer
* **Identifier**: [DOI: 10.3390/frontiers2019](https://doi.org/10.3390/frontiers2019) / [arXiv:1811.07403](https://arxiv.org/abs/1811.07403)
* **Contribution**: Explores mapping Capacitated VRP (CVRP) onto QUBO models and using classical clustering with quantum sub-routing solvers.
* **Influence on Q-Route**: Informs the sub-routing partition strategy and vehicle capacity reconstruction (`routeReconstruction.ts`).

### Glos, A., Krawiec, A., & Zimborás, Z. (2022)
* **Title**: Space-efficient binary encoding for Travelling Salesperson Problems
* **Identifier**: [arXiv:2009.07309](https://arxiv.org/abs/2009.07309)
* **Contribution**: Analyzes binary variable count scaling and penalty landscape tuning for NISQ algorithms.
* **Influence on Q-Route**: Informs penalty coefficient tuning defaults ($P_A = P_B = 500$) and repair strategies in `feasibility.ts`.
