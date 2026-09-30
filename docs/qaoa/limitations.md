# Technical Limitations & NISQ Challenges

This document candidly details the technical limitations of QAOA for vehicle routing in the NISQ (Noisy Intermediate-Scale Quantum) era.

---

## 1. Qubit Scaling ($N^2$ Problem)

Standard binary position encoding for Travelling Salesperson / Vehicle Routing Problems requires $M = N \times N$ qubits for $N$ customer nodes.

| Customers ($N$) | Required Qubits ($N^2$) | Hilbert Space Size ($2^M$) |
| :--- | :--- | :--- |
| 3 | 9 qubits | $2^9 = 512$ states |
| 4 | 16 qubits | $2^{16} = 65,536$ states |
| 5 | 25 qubits | $2^{25} \approx 3.35 \times 10^7$ states |
| 10 | 100 qubits | $2^{100} \approx 1.26 \times 10^{30}$ states |

On current hardware, physical qubit limits necessitate problem decomposition or hybrid classical-quantum sub-routing.

---

## 2. Circuit Depth & Noise Accumulation

Higher QAOA layers ($p > 3$) increase circuit depth linearly. On noisy NISQ devices, two-qubit CNOT gate errors and decoherence cause quantum state degradation, reducing measurement contrast.

---

## 3. Penalty Coefficient Sensitivity

If penalty coefficients $P_A, P_B$ are set too low, measurement samples yield infeasible bitstrings with unvisited cities or position collisions. If penalties are set too high, they dominate the energy landscape, obscuring distance cost optimization.

---

## 4. Classical Optimizer Bottleneck

Algorithms like SPSA or COBYLA require multiple circuit executions per iteration step to approximate gradients, adding classical computation overhead.
