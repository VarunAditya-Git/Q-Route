import React from 'react';
import { Cpu, Layers, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ProductPositioningBanner } from '../landing/ProductPositioningBanner';

export const ResearchModeView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">HACKATHON RESEARCH MODE</Badge>
            <Badge variant="cyan" className="font-mono">CVRP Benchmark</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Theoretical Research & Formulation Mode
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Mathematical formulations, QUBO matrix mappings, and quantum algorithm specifications for hackathon review.
          </p>
        </div>
      </div>

      <ProductPositioningBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 text-cyan-400 flex items-center gap-2">
            <Layers className="w-4 h-4" /> ALGORITHM & FORMULATION SPECS
          </h3>

          <div className="space-y-2.5">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Problem Class:</span>
              <span className="text-white font-bold">Capacitated VRP (CVRP)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Classical Metaheuristic:</span>
              <span className="text-emerald-400 font-bold">Hybrid Genetic Search (HGS)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Quantum Formulation:</span>
              <span className="text-purple-300 font-bold">QUBO Matrix Mapping</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Quantum Algorithm:</span>
              <span className="text-purple-400 font-bold">QAOA / VQE</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Target Hardware / Simulator:</span>
              <span className="text-cyan-400 font-bold">IBM Quantum / Qiskit Aer</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Benchmark Dataset:</span>
              <span className="text-amber-300 font-bold">CVRPLIB Standard Instances</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 text-purple-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> QUBO HAMILTONIAN MATRICES
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-purple-200 space-y-3 leading-relaxed">
            <div className="text-[10px] text-slate-500 uppercase">// Cost Minimization Terms</div>
            <div className="text-xs">
              {"$H_{\\text{cost}} = \\sum_{i,j,k} d_{ij} x_{i,j,k}$"}
            </div>
            <div className="text-[10px] text-slate-500 uppercase">// Capacity & Visit Penalty Constraints</div>
            <div className="text-xs">
              {"$H_{\\text{penalty}} = P_1 \\sum_i \\left(\\sum_{j,k} x_{i,j,k} - 1\\right)^2 + P_2 \\sum_k \\max\\left(0, \\sum_i q_i - Q\\right)^2$"}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Future Work & Extensions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
          {[
            '• Scaling to N > 100 VRP Instances',
            '• IBM Quantum Hardware API bindings',
            '• Hybrid quantum-classical decomposition',
            '• Time-window constraints (VRPTW)',
            '• Multi-depot VRP (MDVRP)',
            '• Dynamic real-time vehicle routing',
            '• Real-world GIS logistics integration',
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/40 transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
