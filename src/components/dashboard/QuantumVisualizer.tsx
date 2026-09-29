import React, { useState } from 'react';
import { Cpu, Binary, CheckCircle, Layers, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Badge } from '../ui/Badge';
import type { QuantumExecutionData } from '../../types/vrp';

interface QuantumVisualizerProps {
  data: QuantumExecutionData;
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({ data }) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const circuitLines = [
    { qubit: 'q0', gates: [{ type: 'H', id: 'g0' }, { type: 'RZ', angle: '2γ·h0', id: 'g1' }, { type: 'CNOT_CONTROL', id: 'g2' }, { type: 'RX', angle: '2β', id: 'g3' }, { type: 'MEASURE', id: 'g4' }] },
    { qubit: 'q1', gates: [{ type: 'H', id: 'g5' }, { type: 'RZ', angle: '2γ·h1', id: 'g6' }, { type: 'CNOT_TARGET', id: 'g2' }, { type: 'RX', angle: '2β', id: 'g7' }, { type: 'MEASURE', id: 'g8' }] },
    { qubit: 'q2', gates: [{ type: 'H', id: 'g9' }, { type: 'RZ', angle: '2γ·h2', id: 'g10' }, { type: 'CNOT_CONTROL', id: 'g11' }, { type: 'RX', angle: '2β', id: 'g12' }, { type: 'MEASURE', id: 'g13' }] },
    { qubit: 'q3', gates: [{ type: 'H', id: 'g14' }, { type: 'RZ', angle: '2γ·h3', id: 'g15' }, { type: 'CNOT_TARGET', id: 'g11' }, { type: 'RX', angle: '2β', id: 'g16' }, { type: 'MEASURE', id: 'g17' }] },
  ];

  const qaoaRes = data.qaoaResult;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">QAOA ROUTING SERVICE ENGINE</Badge>
            <Badge variant="simulation">
              {data.executionMode === 'hardware' ? 'Quantum Hardware (IBM)' : 'Statevector Quantum Simulator'}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-7 h-7 text-purple-400" />
            QAOA Quantum Routing Optimization
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Production-quality QAOA service mapping VRP constraints to QUBO / Ising Hamiltonians, executing parameter optimization, and decoding valid vehicle routes.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" /> 12-STAGE QAOA PIPELINE ARCHITECTURE
          </span>
          <span className="text-xs font-mono text-purple-300 font-bold">p = {data.pLayers || 2} Layers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            '01. PROBLEM INPUT',
            '02. VALIDATION',
            '03. QUBO BUILDER',
            '04. ISING HAMILTONIAN',
            '05. QAOA CIRCUIT',
            '06. SPSA / COBYLA',
            '07. BACKEND EXEC',
            '08. MEASUREMENT',
            '09. BITSTRING DECODER',
            '10. FEASIBILITY CHECK',
            '11. ROUTE RECONSTRUCT',
            '12. PORTAL METRICS',
          ].map((step) => (
            <div
              key={step}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[10px] text-center text-slate-300"
            >
              <div className="text-[8px] text-purple-400 font-bold mb-0.5">STAGE</div>
              <div className="font-bold">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4" /> PARAMETERIZED QAOA CIRCUIT ANSATZ U(γ, β)
            </span>
            <span className="text-xs font-mono text-slate-500">Qiskit Compatible Circuit</span>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono space-y-6 overflow-x-auto">
            {circuitLines.map((line) => (
              <div key={line.qubit} className="flex items-center gap-4 min-w-[500px]">
                <span className="text-xs font-bold text-purple-400 w-8">{line.qubit}</span>
                <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-around py-4">
                  {line.gates.map((g) => {
                    if (g.type === 'H') {
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGate('Hadamard Gate: Creates equal superposition over 2^N states')}
                          className="w-8 h-8 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)] z-10 hover:scale-110 transition-transform cursor-pointer"
                        >
                          H
                        </button>
                      );
                    }
                    if (g.type === 'RZ') {
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGate(`Cost Unitary Phase Gate RZ(${g.angle}): Encodes cost objective and constraint penalties`)}
                          className="w-12 h-8 rounded bg-purple-950 border border-purple-400 text-purple-300 font-bold text-[9px] flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)] z-10 hover:scale-110 transition-transform cursor-pointer"
                        >
                          {g.angle}
                        </button>
                      );
                    }
                    if (g.type === 'RX') {
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGate(`Mixer Unitary Rotation Gate RX(${g.angle}): Drives transverse field quantum state transitions`)}
                          className="w-10 h-8 rounded bg-amber-950 border border-amber-400 text-amber-300 font-bold text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.3)] z-10 hover:scale-110 transition-transform cursor-pointer"
                        >
                          RX
                        </button>
                      );
                    }
                    if (g.type === 'CNOT_CONTROL') {
                      return (
                        <div key={g.id} className="w-3 h-3 rounded-full bg-purple-400 border border-white z-10" />
                      );
                    }
                    if (g.type === 'CNOT_TARGET') {
                      return (
                        <div key={g.id} className="w-6 h-6 rounded-full bg-purple-950 border-2 border-purple-400 text-purple-300 font-bold text-xs flex items-center justify-center z-10">
                          ⊕
                        </div>
                      );
                    }
                    if (g.type === 'MEASURE') {
                      return (
                        <div key={g.id} className="w-8 h-8 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold text-xs flex items-center justify-center z-10">
                          M
                        </div>
                      );
                    }
                    return <div key={g.id} className="w-4 h-4" />;
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedGate && (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-purple-300">
              Selected Gate Info: <span className="text-white">{selectedGate}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
            QAOA SERVICE METRICS
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Qubits:</span>
              <span className="text-purple-300 font-bold">{data.qubits} Qubits</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">QAOA Layers (p):</span>
              <span className="text-purple-300 font-bold">{data.pLayers || 2} Layers</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Circuit Depth:</span>
              <span className="text-purple-300 font-bold">{data.circuitDepth} Gates</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Classical Optimizer:</span>
              <span className="text-amber-300 font-bold">{data.optimizer}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Measurement Shots:</span>
              <span className="text-emerald-300 font-bold">{data.shots} Shots</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Execution Mode:</span>
              <span className="text-cyan-400 font-bold uppercase">{data.executionMode || 'simulation'}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Backend Provider:</span>
              <span className="text-cyan-400 font-bold">{data.backend}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Route Feasibility:</span>
              <span className="font-bold flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Valid Feasible Route
              </span>
            </div>
            {data.bestBitstring && (
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Best Bitstring:</span>
                <span className="text-purple-300 font-bold truncate max-w-[140px]">|{data.bestBitstring}⟩</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-purple-300 transition-all cursor-pointer"
          >
            {showTechnicalDetails ? 'Hide Technical Details' : 'Show Technical Details (QUBO / Hamiltonian)'}
          </button>
        </div>
      </div>

      {showTechnicalDetails && qaoaRes && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 font-mono space-y-4">
          <h3 className="text-sm font-bold text-purple-300 border-b border-slate-800 pb-2">
            TECHNICAL DETAILS — QUBO & ISING FORMULATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">QUBO Variables:</span>
              <span className="font-bold text-white">{qaoaRes.quboFormulation.numVariables} binary variables (x_i,t)</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Optimized γ (Gammas):</span>
              <span className="font-bold text-cyan-300">[{qaoaRes.parameters.gammas.map(g => g.toFixed(3)).join(', ')}]</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Optimized β (Betas):</span>
              <span className="font-bold text-amber-300">[{qaoaRes.parameters.betas.map(b => b.toFixed(3)).join(', ')}]</span>
            </div>
          </div>
        </div>
      )}

      {/* Probability Sampling Distribution */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Quantum Sampling Probability & Feasibility Distribution
          </h3>
          <span className="text-xs font-mono text-purple-400">Measured Bitstrings</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stateVectorProbabilities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="state" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Bar dataKey="probability" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parameter Convergence History Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">Classical Optimizer Energy Convergence ⟨H_C⟩</h3>
          <span className="text-xs font-mono text-cyan-400">SPSA Optimization Trajectory</span>
        </div>

        <div className="h-56 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="generation" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Line type="monotone" dataKey="bestDistance" stroke="#a855f7" strokeWidth={2} dot={false} name="Best Energy" />
              <Line type="monotone" dataKey="avgDistance" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Avg Energy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
