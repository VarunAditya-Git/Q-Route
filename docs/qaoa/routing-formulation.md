# Mathematical Routing Formulation: QUBO to Ising

This document details how Q-Route formulates vehicle routing instances as Quadratic Unconstrained Binary Optimization (QUBO) problems and maps them onto Ising spin Hamiltonians for QAOA execution.

---

## 1. Binary Decision Variables

For $N$ customer nodes and $N$ tour order positions $t \in \{0, 1, \dots, N-1\}$, we define binary variables:

$$x_{i, t} \in \{0, 1\}$$

where:
- $x_{i, t} = 1$ if customer node $i$ is visited at step $t$ in the tour.
- $x_{i, t} = 0$ otherwise.

Total binary variables required: $M = N \times N$.

---

## 2. Objective Function (Minimize Travel Cost)

The total route distance objective $H_{cost}$ includes three components:

1. **Depot Departure (Step 0)**:
   $$\sum_{i=0}^{N-1} d(\text{Depot}, i) \cdot x_{i, 0}$$

2. **Customer Transitions ($t \to t+1$)**:
   $$\sum_{t=0}^{N-2} \sum_{i=0}^{N-1} \sum_{j \neq i}^{N-1} d(i, j) \cdot x_{i, t} \cdot x_{j, t+1}$$

3. **Depot Return (Step $N-1$)**:
   $$\sum_{i=0}^{N-1} d(i, \text{Depot}) \cdot x_{i, N-1}$$

---

## 3. Hard Constraints and Penalty Terms

To guarantee physical feasibility, two penalty terms are added:

### Penalty A: Unique Visit per Customer
Every customer $i$ must be visited at exactly one position $t$:

$$P_A \sum_{i=0}^{N-1} \left( \sum_{t=0}^{N-1} x_{i, t} - 1 \right)^2$$

### Penalty B: Unique Customer per Position
Every order position $t$ must be assigned to exactly one customer $i$:

$$P_B \sum_{t=0}^{N-1} \left( \sum_{i=0}^{N-1} x_{i, t} - 1 \right)^2$$

---

## 4. Total QUBO Form

Combining objective and penalty terms yields the QUBO matrix $Q$:

$$E(x) = x^T Q x + C = \sum_{u=0}^{M-1} Q_{uu} x_u + \sum_{u < v} 2 Q_{uv} x_u x_v + C$$

---

## 5. Conversion to Ising Spin Hamiltonian

Quantum hardware executes spins $Z_i \in \{+1, -1\}$ rather than binary variables $x_i \in \{0, 1\}$.

Using the linear transformation:

$$x_i = \frac{1 - Z_i}{2}$$

Substituting into $E(x)$ derives the **Cost Hamiltonian** $H_C$:

$$H_C = \sum_{i=0}^{M-1} h_i Z_i + \sum_{i < j} J_{ij} Z_i Z_j + E_0$$

where:
- $J_{ij} = \frac{Q_{ij} + Q_{ji}}{4}$
- $h_i = -\frac{Q_{ii}}{2} - \sum_{j \neq i} \frac{Q_{ij} + Q_{ji}}{4}$
- $E_0 = C + \sum_i \frac{Q_{ii}}{2} + \sum_{i < j} \frac{Q_{ij} + Q_{ji}}{4}$

And the **Mixer Hamiltonian** $H_M$:

$$H_M = \sum_{i=0}^{M-1} X_i$$
