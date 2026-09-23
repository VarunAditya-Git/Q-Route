import React from 'react';
import { Cpu, Layers, Sparkles, BookOpen, ExternalLink, Code2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ProductPositioningBanner } from '../landing/ProductPositioningBanner';

export const ResearchModeView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">HACKATHON RESEARCH MODE</Badge>
            <Badge variant="emerald" className="font-mono">Vidal (2022) HGS-CVRP</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Theoretical Research & Formulation Mode
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Algorithmic principles, academic citations, Split dynamic programming formulations, and future QUBO Hamiltonian specifications.
          </p>
        </div>
      </div>

      <ProductPositioningBanner />

      {/* Academic Citation Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Primary Academic Grounding & Reference Implementation</span>
          </h3>
          <Badge variant="emerald">Peer Reviewed</Badge>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300 leading-relaxed">
            <div className="text-white font-bold text-sm">
              &quot;Hybrid Genetic Search for the CVRP: Open-Source Implementation and SWAP* Neighborhood&quot;
            </div>
            <div className="text-slate-400">
              <span className="text-emerald-400">Author:</span> Thibaut Vidal (2022). <br />
              <span className="text-emerald-400">Journal:</span> <em>Computers & Operations Research</em>, Volume 140, 105643.
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://arxiv.org/abs/2012.10384"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> arXiv:2012.10384 [math.OC]
              </a>
              <a
                href="https://github.com/vidalt/HGS-CVRP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1.5 underline"
              >
                <Code2 className="w-3.5 h-3.5" /> GitHub: vidalt/HGS-CVRP
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Chromosome</span>
              <span className="text-white font-semibold">Giant Tour Permutation</span>
              <p className="text-[11px] text-slate-400 mt-1">Trip-delimiter-free representation $[1, \dots, N]$</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Split Algorithm</span>
              <span className="text-emerald-400 font-semibold">Dynamic Programming</span>
              <p className="text-[11px] text-slate-400 mt-1">Prins/Vidal shortest path on DAG with capacity penalties</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Diversity Management</span>
              <span className="text-cyan-400 font-semibold">Bi-Objective Biased Fitness</span>
              <p className="text-[11px] text-slate-400 mt-1">Broken-pairs distance prevents premature population collapse</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left Column: Problem Specs */}
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
              <span className="text-slate-500">Local Search Neighborhoods:</span>
              <span className="text-emerald-300 font-bold">2-Opt, Relocate, Swap (VND)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Quantum Formulation (Phase 2):</span>
              <span className="text-purple-300 font-bold">QUBO Matrix Mapping</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Quantum Algorithm (Phase 2):</span>
              <span className="text-purple-400 font-bold">QAOA / VQE Hybrid</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Deterministic Seed Support:</span>
              <span className="text-amber-300 font-bold">Mulberry32 PRNG (Default 42)</span>
            </div>
          </div>
        </div>

        {/* Right Column: QUBO Hamiltonian */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 text-purple-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> QUBO HAMILTONIAN MATRICES (PHASE 2)
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-purple-200 space-y-3 leading-relaxed">
            <div className="text-[10px] text-slate-500 uppercase">// Cost Minimization Hamiltonian</div>
            <div className="text-xs">
              {"$H_{\\text{cost}} = \\sum_{i,j,k} d_{ij} x_{i,j,k}$"}
            </div>
            <div className="text-[10px] text-slate-500 uppercase">// Capacity & Visit Penalty Constraints</div>
            <div className="text-xs">
              {"$H_{\\text{penalty}} = P_1 \\sum_i \\left(\\sum_{j,k} x_{i,j,k} - 1\\right)^2 + P_2 \\sum_k \\max\\left(0, \\sum_i q_i - Q\\right)^2$"}
            </div>
            <div className="text-[10px] text-slate-500 uppercase">// Biased Fitness (Vidal 2022)</div>
            <div className="text-xs text-cyan-300">
              {"$B(S) = \\text{rank}_{\\text{cost}}(S) + \\left(1 - \\frac{n_{\\text{elite}}}{\\mu}\\right) \\cdot \\text{rank}_{\\text{div}}(S)$"}
            </div>
          </div>
        </div>
      </div>

      {/* Future Work & Extensions */}
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
