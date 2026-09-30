# 💻 Software Implementation Architecture

![TypeScript](https://img.shields.io/badge/TypeScript-v6.0-3178C6?style=for-the-badge&logo=typescript)
![Modular Architecture](https://img.shields.io/badge/Architecture-12_Modules-10B981?style=for-the-badge)

This document describes the modular codebase organization under `src/services/qaoa/`.

---

## 🎨 Module Dependency & Dataflow Diagram

> [!TIP]
> **Module Classification**:
> 🟦 **Setup & Types**: `types.ts`, `validator.ts`
> 🟩 **Math Formulation**: `quboBuilder.ts`, `hamiltonianBuilder.ts`
> 🟪 **Ansatz & Optimization**: `circuitBuilder.ts`, `optimizer.ts`, `backendAdapter.ts`
> 🟨 **Decoding & Repair**: `decoder.ts`, `feasibility.ts`, `routeReconstruction.ts`
> 🟧 **Orchestrator**: `qaoaService.ts`, `index.ts`

```mermaid
graph TD
    classDef setup fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef math fill:#059669,stroke:#34d399,stroke-width:2px,color:#ffffff;
    classDef circuit fill:#7c3aed,stroke:#c084fc,stroke-width:2px,color:#ffffff;
    classDef post fill:#d97706,stroke:#fbbf24,stroke-width:2px,color:#ffffff;
    classDef orch fill:#c2410c,stroke:#fb923c,stroke-width:2px,color:#ffffff;

    MAIN["qaoaService.ts<br/><i>(Pipeline Orchestrator)</i>"]:::orch
    VAL["validator.ts<br/><i>(Validation & Distance Matrix)</i>"]:::setup
    QUBO["quboBuilder.ts<br/><i>(QUBO Formulation)</i>"]:::math
    HAM["hamiltonianBuilder.ts<br/><i>(Ising Spin Mapping)</i>"]:::math
    CIRC["circuitBuilder.ts<br/><i>(Gate Ansatz)</i>"]:::circuit
    OPT["optimizer.ts<br/><i>(SPSA Angle Tuner)</i>"]:::circuit
    BACK["backendAdapter.ts<br/><i>(Statevector / Aer / IBM Q)</i>"]:::circuit
    DEC["decoder.ts<br/><i>(Bitstring Parser)</i>"]:::post
    FEAS["feasibility.ts<br/><i>(Collision Repair Heuristic)</i>"]:::post
    RECON["routeReconstruction.ts<br/><i>(Fleet Capacity Partition)</i>"]:::post

    MAIN --> VAL
    MAIN --> QUBO
    MAIN --> HAM
    MAIN --> CIRC
    MAIN --> OPT
    OPT --> BACK
    MAIN --> DEC
    MAIN --> FEAS
    MAIN --> RECON
```

---

## Code Directory Structure

```text
src/services/qaoa/
├── types.ts                   # Type definitions, interfaces & QAOA result schemas
├── validator.ts               # Input problem validator & spatial distance matrix
├── quboBuilder.ts             # QUBO matrix formulation generator
├── hamiltonianBuilder.ts      # QUBO-to-Ising conversion & spin energy evaluator
├── circuitBuilder.ts          # QAOA parameterized quantum circuit ansatz builder
├── optimizer.ts               # Classical parameter optimizer (SPSA / COBYLA / ADAM)
├── backendAdapter.ts          # Simulator & quantum hardware execution adapter
├── decoder.ts                 # Bitstring-to-customer order decoder
├── feasibility.ts             # Feasibility checker & documented route repair
├── routeReconstruction.ts     # Vehicle capacity partitioning & route reconstruction
├── qaoaService.ts             # High-level pipeline orchestrator
└── index.ts                   # Barrel export file
```

---

## Core Components & Responsibilities

### 1. `validator.ts`
- Verifies depot existence, customer coordinate bounds, and constructs symmetric Euclidean distance matrix $d(i, j)$.

### 2. `quboBuilder.ts`
- Generates symmetric $M \times M$ matrix $Q$ representing distance costs and quadratic penalty terms $P_A, P_B$.

### 3. `hamiltonianBuilder.ts`
- Converts binary variables $x_i = \frac{1-Z_i}{2}$ to derive single Pauli-$Z_i$ linear coefficients $h_i$ and pair Pauli-$Z_i Z_j$ interaction coefficients $J_{ij}$.

### 4. `circuitBuilder.ts`
- Generates parameterized gate sequence instructions ($H$, $RZ$, $RX$, $CNOT$, $M$) for UI schematic rendering and simulator execution.

### 5. `optimizer.ts`
- Implements classical optimization loops tuning angles $\vec{\gamma}$ and $\vec{\beta}$ to minimize energy expectation $\langle H_C \rangle$.

### 6. `backendAdapter.ts`
- Decouples solver logic from execution engines. Supports local statevector calculation, shot-based sampling, and hardware configuration integration.

### 7. `decoder.ts` & `feasibility.ts`
- Translates binary bitstrings into customer sequences, detects position collisions/unvisited nodes, and applies a deterministic repair heuristic to guarantee physical route output.

### 8. `routeReconstruction.ts`
- Partitions ordered customer visits into fleet vehicles according to capacity limits $Q$, calculating exact vehicle travel distances and visit orders.
