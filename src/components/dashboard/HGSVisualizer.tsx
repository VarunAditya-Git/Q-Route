import React, { useState, useEffect } from 'react';
import { Dna, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '../ui/Badge';
import type { HGSExecutionData } from '../../types/vrp';

interface HGSVisualizerProps {
  data: HGSExecutionData;
}

export const HGSVisualizer: React.FC<HGSVisualizerProps> = ({ data }) => {
  const [activeGen, setActiveGen] = useState(1);

  useEffect(() => {
    const genSteps = [1, 10, 25, 50, 100];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % genSteps.length;
      setActiveGen(genSteps[idx]);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const pipelineSteps = [
    'INITIAL POPULATION',
    'SELECTION',
    'CROSSOVER',
    'LOCAL SEARCH (2-OPT)',
    'EVALUATION',
    'POPULATION UPDATE',
    'NEXT GENERATION',
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald">CLASSICAL BASELINE METAHEURISTIC</Badge>
            <Badge variant="simulation">Simulated HGS execution</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Classical Baseline — Hybrid Genetic Search
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            HGS combines population-based genetic search with aggressive local improvement to explore a large routing search space.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Dna className="w-4 h-4" /> HGS ALGORITHMIC PIPELINE
          </span>
          <span className="text-xs font-mono text-slate-400">Active Gen: #{activeGen}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {pipelineSteps.map((step, idx) => {
            const isCurrent = idx === (Math.floor(activeGen / 15) % pipelineSteps.length);
            return (
              <div
                key={step}
                className={`p-3 rounded-xl border text-center transition-all duration-300 font-mono text-[11px] ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[9px] text-slate-500 font-bold mb-1">STEP 0{idx + 1}</div>
                <div className="font-bold leading-tight">{step}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.population.map((sol) => (
          <div
            key={sol.id}
            className={`glass-card p-4 rounded-xl border font-mono transition-all ${
              sol.isBest
                ? 'border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold">{sol.id}</span>
              {sol.isBest && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 font-bold">
                  <Award className="w-3 h-3" /> BEST
                </span>
              )}
            </div>

            <div className="text-2xl font-extrabold text-white mb-1">
              {sol.distance} <span className="text-xs text-slate-400 font-normal">km</span>
            </div>

            <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
              <span>Fitness Score:</span>
              <span className="text-emerald-400 font-bold">{(sol.fitnessScore * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">HGS Convergence History</h3>
            <p className="text-xs text-slate-400 font-mono">Best Distance vs Average Distance across 100 Generations</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Best Distance
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Average Distance
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="generation" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Line type="monotone" dataKey="bestDistance" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="avgDistance" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
