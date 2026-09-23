# Q-Route ⚡ 
### Quantum-Enhanced Vehicle Routing Optimization

> *"From impossible combinations to optimized routes."*
> 
> **"Finding a good route is easy. Finding the best route among an enormous number of possible combinations is the real problem."**

Q-Route is an interactive web platform prototype developed for a university quantum-computing hackathon. It explores hybrid classical and quantum combinatorial optimization techniques to solve the **Capacitated Vehicle Routing Problem (CVRP)**.

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
    │    Classical Baseline    │           │   Quantum Optimization   │
    │  Hybrid Genetic Search   │           │    (QUBO / QAOA Module)  │
    │          (HGS)           │           │   [Research Prototype]   │
    └────────────┬─────────────┘           └─────────────┬────────────┘
                 │                                       │
                 ▼                                       ▼
    ┌──────────────────────────┐           ┌──────────────────────────┐
    │ Population Evolution     │           │ Quadratic Hamiltonian    │
    │  + 2-Opt Local Search    │           │  + Quantum Phase Circuit │
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

### 1. Classical Baseline — Hybrid Genetic Search (HGS)
- Industry standard metaheuristic combining genetic algorithms (ordered crossover, tournament selection) with aggressive 2-opt local search heuristic.
- Highly scalable and provides the grounded benchmark for all routing comparisons.

### 2. Quantum Optimization — QUBO / QAOA Formulation
- Maps CVRP decision variables $x_{ijk} \in \{0, 1\}$ into a **Quadratic Unconstrained Binary Optimization (QUBO)** matrix:
  $$H(\mathbf{x}) = \sum_{ij} Q_{ij} x_i x_j + \lambda_1 \sum_k \text{Penalty}_{\text{capacity}} + \lambda_2 \sum_i \text{Penalty}_{\text{visit}}$$
- Parameterized Quantum Approximate Optimization Algorithm (QAOA) ansatz executed with variational parameter updates ($\gamma, \beta$).

> [!NOTE]
> **Product Positioning Distinction**: *"We are not replacing classical optimization blindly. Q-Route establishes a strong classical baseline using Hybrid Genetic Search and investigates whether quantum optimization can provide useful improvements for selected routing formulations."*

---

## ✨ Features & Prototype Capabilities

- **Interactive Hero Visualizer**: Live multi-stage route evolution (`INITIAL ROUTES` → `CROSSING ROUTES` → `OPTIMIZATION` → `CLEAN ROUTES`) with real-time animated traveling light particles and simulated distance countdown (1,284 km → 867 km).
- **Combinatorial Space Visualizer**: Interactive customer scale calculator demonstrating combinatorial explosion ($10! \to 20! \to 50!$) with spidering permutation paths.
- **Interactive Coordinate Route Map**: Full 1000 × 1000 coordinate plane featuring Central Depot, customer nodes with demand badges, per-vehicle route toggles, isolate filters, and interactive node inspector popovers.
- **Problem Configurator**: Dynamic problem generation controlling fleet size, customer counts, spatial distributions (clustered, radial, random, grid), and hard constraints.
- **HGS Genetic Visualizer**: Step-by-step pipeline inspector and convergence chart tracking Best Distance vs Average Distance over 100 generations.
- **Quantum Circuit Visualizer**: Stylized quantum circuit schematic with interactive gate inspector (Hadamard, CNOT, Phase Rotation $R_Z$) and measurement bitstring probability distribution.
- **Side-by-Side Comparison Matrix**: Direct metric breakdown across Best Distance, Execution Runtime, Constraint Violations, and Fleet Efficiency.
- **Research Mode**: Mathematical formulations, QUBO matrix definitions, and future work roadmap for real IBM Quantum hardware integration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/VarunAditya-Git/Q-Route.git
cd Q-Route

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173/` to explore the platform.

### Building for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System, Glassmorphism
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React

---

## 🔮 Future Backend Architecture

Designed with a modular service layer ready to connect to a FastAPI Python backend:
- `POST /problem/generate`
- `POST /optimize/hgs`
- `POST /optimize/quantum`
- `GET /optimization/{id}`
- `GET /optimization/{id}/results`

