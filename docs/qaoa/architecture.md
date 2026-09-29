# System Architecture & Integration

This document outlines how the QAOA Routing Service integrates into the existing Q-Route portal architecture without disrupting classical algorithms or UI components.

---

## 1. System Integration Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND LAYER (React 19)                        │
│                                                                             │
│  ┌──────────────────────┐   ┌──────────────────────┐  ┌──────────────────┐ │
│  │ ProblemConfigurator  │   │   QuantumVisualizer  │  │   RouteMap       │ │
│  │ (QAOA Hyperparams)   │   │ (Schematics & Hist)  │  │ (Vehicle Paths)  │ │
│  └──────────┬───────────┘   └──────────▲───────────┘  └────────▲─────────┘ │
└─────────────│──────────────────────────│───────────────────────│────────────┘
              │                          │                       │
              ▼                          │                       │
┌────────────────────────────────────────┴───────────────────────┴────────────┐
│                             API LAYER (src/services/api.ts)                 │
│                                                                             │
│                   QRouteAPI.optimizeQAOA(problemId, config)                 │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          QAOA SERVICE LAYER (src/services/qaoa/*)           │
│                                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │ quboBuilder  │──►│ hamiltonian  │──►│  optimizer  │──►│  feasibility │  │
│  └──────────────┘   └──────────────┘   └─────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Principles

1. **Non-Invasive Integration**: QAOA is added as a first-class algorithm option alongside HGS. Existing data structures (`OptimizationResult`, `Vehicle`, `CustomerNode`) remain completely backward compatible.
2. **UI Decoupling**: The frontend displays understandable metrics (route cost, vehicle paths, quantum confidence) without needing to understand raw quantum matrix math.
3. **Backend Independence**: Execution engines are fully abstracted behind `backendAdapter.ts`.
