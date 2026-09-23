import React, { useState } from 'react';
import { Dna, Cpu } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { OptimizationResult } from '../../types/vrp';

interface ComparisonViewProps {
  data: OptimizationResult;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data }) => {
  const [problemScale, setProblemScale] = useState<number>(50);

  const hgsDist = Math.round(data.totalDistance * (problemScale / 50));
  const quantumDist = Math.round(hgsDist * 0.981);
  const hgsRuntime = (2.8 * (problemScale / 50)).toFixed(1);
  const quantumRuntime = (4.6 * (problemScale / 50)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan">BENCHMARK COMPARISON</Badge>
            <Badge variant="simulation">Illustrative simulation — not experimental benchmark results.</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Classical vs Quantum Optimization
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Side-by-side evaluation of Hybrid Genetic Search baseline versus experimental QUBO/QAOA formulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block uppercase">CLASSICAL BASELINE</span>
                <h3 className="text-lg font-bold text-white">Hybrid Genetic Search</h3>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Baseline
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Search Strategy:</span>
              <span className="font-bold text-slate-200">Population-based metaheuristic</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Strength:</span>
              <span className="font-bold text-emerald-400">Large problem sizes ($N &gt; 100$)</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-cyan-400">Production Baseline</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold block uppercase">QUANTUM OPTIMIZATION</span>
                <h3 className="text-lg font-bold text-white">QUBO / QAOA Formulation</h3>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
              Research Prototype
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Search Strategy:</span>
              <span className="font-bold text-slate-200">Quantum optimization (QAOA)</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Strength:</span>
              <span className="font-bold text-purple-400">Combinatorial space exploration</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-purple-300">Research Prototype</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Adjust Customer Problem Scale ($N$) for Benchmark Simulation:</span>
          <span className="text-cyan-400 font-bold text-sm">{problemScale} Customers</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={problemScale}
          onChange={e => setProblemScale(parseInt(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">Comparative Performance Benchmark Matrix</h3>
          <span className="text-xs font-mono text-slate-400">Simulated Benchmarks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-emerald-400">Classical HGS</th>
                <th className="py-3 px-4 text-purple-400">Quantum / Hybrid</th>
                <th className="py-3 px-4 text-cyan-400">Delta Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Best Distance</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{hgsDist} km</td>
                <td className="py-3 px-4 text-purple-400 font-bold">{quantumDist} km</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">-1.9% (Better)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Execution Runtime</td>
                <td className="py-3 px-4">{hgsRuntime} s</td>
                <td className="py-3 px-4">{quantumRuntime} s</td>
                <td className="py-3 px-4 text-slate-400">+1.8 s (QAOA overhead)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Constraint Violations</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">0</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">0</td>
                <td className="py-3 px-4 text-slate-400">0 (Both Satisfy)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Vehicles Used</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4 text-slate-400">Optimal Fleet</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Solution Quality</td>
                <td className="py-3 px-4 text-emerald-400">Baseline Optimal</td>
                <td className="py-3 px-4 text-purple-400">Experimental Candidate</td>
                <td className="py-3 px-4 text-purple-300 font-bold">Research Prototype</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
