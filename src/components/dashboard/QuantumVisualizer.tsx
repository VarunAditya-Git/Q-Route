import React, { useState } from 'react';
import { Cpu, Binary, Info, Sparkles, Layers } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { QuantumExecutionData } from '../../types/vrp';

interface QuantumVisualizerProps {
  data: QuantumExecutionData;
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({ data: _data }) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const circuitLines = [
    { qubit: 'q0', gates: [{ type: 'H', id: 'g0' }, { type: 'CNOT_CONTROL', id: 'g1' }, { type: 'RZ', angle: 'γ₀', id: 'g2' }, { type: 'MEASURE', id: 'g3' }] },
    { qubit: 'q1', gates: [{ type: 'H', id: 'g4' }, { type: 'CNOT_TARGET', id: 'g1' }, { type: 'RZ', angle: 'β₀', id: 'g5' }, { type: 'MEASURE', id: 'g6' }] },
    { qubit: 'q2', gates: [{ type: 'H', id: 'g7' }, { type: 'WIRE', id: 'g8' }, { type: 'CNOT_CONTROL', id: 'g9' }, { type: 'MEASURE', id: 'g10' }] },
    { qubit: 'q3', gates: [{ type: 'H', id: 'g11' }, { type: 'WIRE', id: 'g12' }, { type: 'CNOT_TARGET', id: 'g9' }, { type: 'MEASURE', id: 'g13' }] },
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">FUTURE PHASE: QUANTUM-ASSISTED ROUTE IMPROVEMENT (QARI)</Badge>
            <Badge variant="outline" className="text-amber-300 border-amber-500/30 bg-amber-950/40">
              <Info className="w-3 h-3 mr-1 inline" />
              Staged for Phase 2 — Classical HGS Active
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Quantum Extension Architecture (QAOA / QUBO)
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Strict engineering transparency: In this Classical Optimization phase, no synthetic quantum results are fabricated. The real Vidal HGS solution establishes the exact benchmark against which QAOA coprocessors will be evaluated in Phase 2.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-purple-950/40 border border-purple-500/30 px-4 py-2.5 rounded-xl font-mono text-xs text-purple-300">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Extension Target: IBM Quantum / Qiskit</span>
        </div>
      </div>

      {/* Architecture Concept Card */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Hybrid Classical-Quantum Handshake Workflow (Phase 2 Roadmap)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">Step 1 (Active Now)</div>
            <div className="font-bold text-white text-sm">Real HGS Classical Search</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Vidal (2022) HGS-CVRP explores the full combinatorial graph and delivers a strictly feasible, optimized route network.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2">
            <div className="text-[10px] text-purple-400 font-bold uppercase">Step 2 (Phase 2)</div>
            <div className="font-bold text-white text-sm">Subproblem QUBO Decomposition</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Bottleneck clusters or intersecting routes are isolated and mapped onto Quadratic Unconstrained Binary Optimization (QUBO) forms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
            <div className="text-[10px] text-cyan-400 font-bold uppercase">Step 3 (Phase 2)</div>
            <div className="font-bold text-white text-sm">QPU Execution & Verification</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              QAOA circuits execute on hardware/statevector simulator; proposed improvements are merged back only if they strictly beat the HGS baseline.
            </p>
          </div>
        </div>
      </div>

      {/* Quantum Pipeline Schematic */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> QUANTUM COMPILATION STAGES
          </span>
          <span className="text-xs font-mono text-slate-400">QAOA / Ising Mapping</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { step: 'CVRP GRAPH', desc: 'Depot & N nodes' },
            { step: 'HGS BASELINE', desc: 'Real classical routes' },
            { step: 'QUBO MATRIX', desc: 'Q_ij penalty terms' },
            { step: 'ANSATZ CIRCUIT', desc: 'p-layer QAOA' },
            { step: 'PARAM OPTIMIZER', desc: 'COBYLA / SPSA loop' },
            { step: 'BITSTRING MEASURE', desc: 'Candidate routes' },
          ].map((s, idx) => (
            <div
              key={s.step}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-center text-slate-300"
            >
              <div className="text-[9px] text-purple-400 font-bold mb-1">STAGE 0{idx + 1}</div>
              <div className="font-bold text-slate-200">{s.step}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stylized Circuit Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4" /> QAOA PARAMETRIC ANSATZ CIRCUIT SCHEMATIC
            </span>
            <span className="text-xs font-mono text-slate-500">Interactive Circuit Explorer</span>
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
                          onClick={() => setSelectedGate('Hadamard Gate (Creates equal superposition of all 2^N routing assignments)')}
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
                          onClick={() => setSelectedGate(`Phase Rotation Gate RZ(${g.angle}): Encodes problem Hamiltonian cost matrix into quantum phase`)}
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

          {selectedGate ? (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-purple-300">
              Gate Inspection: <span className="text-white">{selectedGate}</span>
            </div>
          ) : (
            <div className="text-[11px] font-mono text-slate-500">
              Click any gate in the circuit diagram above to inspect its quantum mechanical operator function.
            </div>
          )}
        </div>

        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
            PHASE 2 HARDWARE TARGETS
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">BACKEND SYSTEM</span>
              <span className="text-purple-300 font-bold">IBM Quantum (Qiskit Runtime)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TARGET ALGORITHM</span>
              <span className="text-cyan-300 font-bold">Quantum Approximate Optimization (QAOA)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CLASSICAL CO-OPTIMIZER</span>
              <span className="text-amber-300 font-bold">COBYLA / SPSA Loop</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CURRENT PHASE STATUS</span>
              <span className="text-emerald-400 font-bold">Active Classical HGS Baseline (Phase 1)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
