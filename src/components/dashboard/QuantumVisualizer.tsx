import React, { useState } from 'react';
import { Cpu, Binary } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '../ui/Badge';
import type { QuantumExecutionData } from '../../types/vrp';

interface QuantumVisualizerProps {
  data: QuantumExecutionData;
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({ data }) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const circuitLines = [
    { qubit: 'q0', gates: [{ type: 'H', id: 'g0' }, { type: 'CNOT_CONTROL', id: 'g1' }, { type: 'RZ', angle: 'π/4', id: 'g2' }, { type: 'MEASURE', id: 'g3' }] },
    { qubit: 'q1', gates: [{ type: 'H', id: 'g4' }, { type: 'CNOT_TARGET', id: 'g1' }, { type: 'RZ', angle: 'π/2', id: 'g5' }, { type: 'MEASURE', id: 'g6' }] },
    { qubit: 'q2', gates: [{ type: 'H', id: 'g7' }, { type: 'WIRE', id: 'g8' }, { type: 'CNOT_CONTROL', id: 'g9' }, { type: 'MEASURE', id: 'g10' }] },
    { qubit: 'q3', gates: [{ type: 'H', id: 'g11' }, { type: 'WIRE', id: 'g12' }, { type: 'CNOT_TARGET', id: 'g9' }, { type: 'MEASURE', id: 'g13' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">EXPERIMENTAL QUANTUM MODULE</Badge>
            <Badge variant="simulation">Simulated Quantum Execution</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Quantum Optimization (QUBO / QAOA)
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Experimental quantum formulation mapping VRP constraints onto Quadratic Unconstrained Binary Optimization hamiltonians.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> QUANTUM FORMULATION PIPELINE
          </span>
          <span className="text-xs font-mono text-slate-400">QAOA Ansatz</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            'VRP INSTANCE',
            'MATH MODEL',
            'QUBO FORMULATION',
            'QUANTUM CIRCUIT',
            'OPTIMIZATION',
            'ROUTING SOLUTION',
          ].map((step, idx) => (
            <div
              key={step}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-center text-slate-300"
            >
              <div className="text-[9px] text-purple-400 font-bold mb-1">STAGE 0{idx + 1}</div>
              <div className="font-bold">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4" /> STYLIZED QUANTUM CIRCUIT SCHEMATIC
            </span>
            <span className="text-xs font-mono text-slate-500">Qiskit/Pennylane Visualizer</span>
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
                          onClick={() => setSelectedGate('Hadamard Gate (Superposition state generator)')}
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
                          onClick={() => setSelectedGate(`Phase Rotation Gate RZ(${g.angle})`)}
                          className="w-10 h-8 rounded bg-purple-950 border border-purple-400 text-purple-300 font-bold text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)] z-10 hover:scale-110 transition-transform cursor-pointer"
                        >
                          RZ
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
            SIMULATED PARAMETERS
          </div>

          <div className="space-y-3">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Qubits:</span>
              <span className="text-purple-300 font-bold">{data.qubits} Qubits</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Circuit Depth:</span>
              <span className="text-purple-300 font-bold">{data.circuitDepth} Gates</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Optimization Iterations:</span>
              <span className="text-cyan-300 font-bold">{data.iterations}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Measurement Shots:</span>
              <span className="text-emerald-300 font-bold">{data.shots} Shots</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Classical Optimizer:</span>
              <span className="text-amber-300 font-bold">{data.optimizer}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Backend Provider:</span>
              <span className="text-cyan-400 font-bold">{data.backend}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">Quantum Sampling Probability Distribution</h3>
          <span className="text-xs font-mono text-purple-400">Top Bitstring States</span>
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
    </div>
  );
};
