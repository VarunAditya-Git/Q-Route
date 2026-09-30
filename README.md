# Q-Route ⚡ 
### Quantum-Enhanced Vehicle Routing Optimization Service

> *"From impossible combinations to optimized routes."*
> 
> **"Finding a good route is easy. Finding the best route among an enormous number of possible combinations is the real problem."**

Q-Route is an interactive web platform and routing optimization portal. It features a **production-quality QAOA (Quantum Approximate Optimization Algorithm) Routing Service** alongside classical baselines like Hybrid Genetic Search (HGS) for solving Travelling Salesperson (TSP) and Capacitated Vehicle Routing Problems (CVRP).

---

## 🔬 Core Architecture: Hybrid Classical + Quantum

```
                   ┌───────────────────────────────────┐
                   │    VRP Problem Graph Instance     │
                   │ (Depot, Customers, Capacity, Dist)│
                   └─────────────────┬─────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
                 ▼                                       ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐
    │    Classical Baseline    │           │  QAOA Routing Service    │
    │  Hybrid Genetic Search   │           │ (QUBO / Ising Engine)    │
    │          (HGS)           │           │ [First-Class Solver]     │
    └────────────┬─────────────┘           └─────────────┬────────────┘
                 │                                       │
                 ▼                                       ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐
    │ Population Evolution     │           │ 12-Stage QAOA Pipeline   │
    │  + 2-Opt Local Search    │           │  QUBO -> Ising -> SPSA   │
    └────────────┬─────────────┘           └─────────────┬────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │   Comparative Benchmark Analysis  │
                   │  Distance • Runtime • Constraints │
                   └───────────────────────────────────┘
```

### 1. QAOA Routing Optimization Service
- **First-Class Optimization Service**: Full 12-stage execution pipeline converting routing graph instances into QUBO binary matrices, Ising spin Hamiltonians, parameterized QAOA quantum circuit ansatzes $U(\gamma, \beta)$, classical parameter optimizer updates (SPSA / COBYLA / ADAM), quantum statevector / shot sampling, bitstring decoding, and feasibility validation.
- **Backend Independent**: Supports Local Statevector Simulator, Shot-based Aer Simulator, and IBM Quantum remote hardware adapters.

### 2. Classical Baseline — Hybrid Genetic Search (HGS)
- Industry-standard metaheuristic combining genetic algorithms with 2-opt local search heuristics for grounded baseline comparisons.

---

## 📚 QAOA Service Documentation (`docs/qaoa/`)

Comprehensive layered documentation for students, non-CS users, developers, and researchers:

- 📖 [**QAOA Documentation Index**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/README.md)
- 💡 [**Intuitive Concepts Guide**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/concepts.md): VRP, NP-hardness, and QAOA explained in plain English.
- 📐 [**Mathematical Formulation**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/routing-formulation.md): Binary variables $x_{i,t}$, QUBO matrix, constraint penalties $P_A, P_B$, and Ising conversion.
- 🔄 [**12-Stage Pipeline & Worked Example**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/qaoa-pipeline.md): Complete architectural breakdown with Mermaid diagrams and 3-customer worked example.
- 🛠️ [**Implementation Architecture**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/implementation.md): Code structure and file responsibilities in `src/services/qaoa/`.
- ⚙️ [**Configuration Reference**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/configuration.md): Hyperparameter documentation (`pLayers`, `shots`, `optimizer`, `backend`, `penaltyA`, `penaltyB`).
- 💻 [**Hardware & Telemetry**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/hardware.md): Quantum simulators vs IBM Quantum hardware execution.
- ⚠️ [**NISQ Limitations**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/limitations.md): Honest assessment of qubit scaling ($N^2$), circuit depth, and noise.
- 📚 [**Research References**](file:///c:/Users/seera/Desktop/Exploration/QRoute/Q-Route/docs/qaoa/references.md): Farhi et al. (2014), Lucas (2014), Feld et al. (2019) citations with DOIs/arXiv IDs.

---

## ✨ Features & Capabilities

- **QAOA Routing Optimization Service**: Select QAOA as a first-class optimizer alongside HGS baseline.
- **QAOA Hyperparameter Control**: Configure QAOA depth layers ($p$), measurement shots, classical optimizer, execution backend, and penalty multipliers.
- **12-Stage Pipeline Visualizer**: Step-by-step progress tracking through problem validation, QUBO building, circuit ansatz generation, classical tuning, state sampling, and feasibility checks.
- **Quantum Circuit Visualizer**: Interactive quantum circuit schematic with gate inspector ($H, RZ, RX, CNOT, M$), state probabilities, parameter convergence history graph ($\beta, \gamma, \langle H_C \rangle$), and hardware telemetry.
- **Interactive Route Map**: Full 1000 × 1000 coordinate plane featuring Central Depot, customer nodes, vehicle route toggles, and popover inspectors.
- **Side-by-Side Comparison Matrix**: Metric comparison between HGS baseline and QAOA.

---

## 🚀 Getting Started

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/VarunAditya-Git/Q-Route.git
cd Q-Route

# Install dependencies
npm install

# Run automated tests
npm test

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173/` to launch the Q-Route Optimizer.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **QAOA Service**: Custom TypeScript QAOA Engine (`src/services/qaoa/*`)
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System, Glassmorphism
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
