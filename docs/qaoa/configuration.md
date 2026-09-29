# Configuration Reference & Environment Variables

This document provides a complete reference for configuring the QAOA Routing Optimization Service.

---

## 1. QAOA Hyperparameters

| Parameter | Type | Default | Recommended Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `pLayers` | `number` | `2` | `1` – `5` | Number of QAOA circuit depth layers ($p$). Increasing depth improves solution quality but increases circuit gate count. |
| `shots` | `number` | `1024` | `256` – `4096` | Number of quantum measurement sampling shots. |
| `optimizer` | `string` | `'SPSA'` | `'SPSA'`, `'COBYLA'`, `'ADAM'` | Classical optimizer tuning angles $\vec{\gamma}$ and $\vec{\beta}$. |
| `backend` | `string` | `'statevector'` | `'statevector'`, `'aer_simulator'`, `'ibm_sherbrooke'` | Execution target (Statevector simulator, Aer shot-noise simulator, or IBM Quantum hardware). |
| `penaltyA` | `number` | `500` | `100` – `1500` | Multiplier for Penalty A (unique customer visit constraint). |
| `penaltyB` | `number` | `500` | `100` – `1500` | Multiplier for Penalty B (unique position assignment constraint). |
| `maxIterations` | `number` | `50` | `20` – `200` | Maximum iterations for classical parameter optimization. |

---

## 2. Environment Variables

To connect to remote IBM Quantum hardware backends without hardcoding credentials:

```bash
# .env (local development file - excluded from version control)
VITE_IBMQ_API_TOKEN="your_ibm_quantum_api_token_here"
VITE_IBMQ_BACKEND="ibm_sherbrooke"
```

> **Security Note**: Never commit API keys or `.env` files to git. Q-Route reads credentials strictly through environment variables.
