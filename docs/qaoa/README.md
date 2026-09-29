# Q-Route QAOA Routing Optimization Service

Welcome to the documentation for the **QAOA (Quantum Approximate Optimization Algorithm) Routing Service** integrated into the **Q-Route** portal.

This service brings production-quality quantum optimization to vehicle routing problems (VRP) and Travelling Salesperson Problems (TSP), making quantum algorithms a first-class optimization option alongside classical baselines like Hybrid Genetic Search (HGS).

---

## 📚 Documentation Index

| Topic | Document | Target Audience | Description |
| :--- | :--- | :--- | :--- |
| **Intuitive Concepts** | [`concepts.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/concepts.md) | Beginners, non-CS | Plain-language introduction to vehicle routing, combinatorial complexity, and QAOA analogies. |
| **Routing Formulation** | [`routing-formulation.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/routing-formulation.md) | Developers, Researchers | Mathematical formulation of binary decision variables, QUBO matrices, constraint penalties, and Ising spin Hamiltonians. |
| **12-Stage Pipeline** | [`qaoa-pipeline.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/qaoa-pipeline.md) | All | Complete breakdown of the 12-stage routing pipeline with Mermaid diagrams and a worked 3-customer example. |
| **Implementation Architecture** | [`implementation.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/implementation.md) | Developers | Modular codebase structure, file responsibilities, design patterns, and system interfaces (`src/services/qaoa/*`). |
| **System Architecture** | [`architecture.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/architecture.md) | System Architects | Higher-level architectural data flow between frontend visualizers, QRoute API, and the QAOA solver engine. |
| **Configuration Reference** | [`configuration.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/configuration.md) | Operators, Developers | Full reference for QAOA hyperparameters (`pLayers`, `shots`, `optimizer`, `backend`, `penaltyA`, `penaltyB`). |
| **Hardware & Simulation** | [`hardware.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/hardware.md) | Developers, Hardware Users | Simulator backends vs IBM Quantum hardware execution, environment security, and telemetry. |
| **Realistic Limitations** | [`limitations.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/limitations.md) | All | Honest evaluation of NISQ hardware constraints, qubit scaling ($N^2$), circuit depth, and noise. |
| **Troubleshooting Guide** | [`troubleshooting.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/troubleshooting.md) | Developers | Debugging infeasible bitstrings, tuning penalty coefficients, and resolving convergence issues. |
| **Research References** | [`references.md`](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/references.md) | Researchers | Foundational literature citations with arXiv/DOI identifiers and their direct influence on Q-Route. |

---

## ⚡ Quick Start

```typescript
import { solveQAOARouting, DEFAULT_QAOA_CONFIG } from './src/services/qaoa';

// Execute QAOA on problem instance
const result = await solveQAOARouting(depot, customers, vrpConfig, {
  pLayers: 2,
  shots: 1024,
  optimizer: 'SPSA',
  backend: 'statevector',
  penaltyA: 500,
  penaltyB: 500,
});

console.log('Optimized Route Distance:', result.totalDistance);
console.log('Best Bitstring:', result.bestBitstring);
console.log('Is Feasible:', result.feasible);
```
