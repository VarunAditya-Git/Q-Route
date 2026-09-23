import React, { useState } from 'react';
import { Dna, Award, CheckCircle2, Clock, Activity, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '../ui/Badge';
import type { HGSExecutionData } from '../../types/vrp';

interface HGSVisualizerProps {
  data: HGSExecutionData;
}

export const HGSVisualizer: React.FC<HGSVisualizerProps> = ({ data }) => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const pipelineSteps = [
    { title: 'INITIAL POPULATION', desc: 'Sweep & greedy heuristics' },
    { title: 'BIASED FITNESS', desc: 'Bi-objective rank (Vidal 2022)' },
    { title: 'TOURNAMENT SELECTION', desc: 'Biased fitness pressure' },
    { title: 'ORDER CROSSOVER (OX)', desc: 'Permutation-preserving cut' },
    { title: 'DP SPLIT PROCEDURE', desc: 'Prins tour-to-routes DP' },
    { title: 'LOCAL SEARCH (VND)', desc: '2-Opt, Relocate, Swap' },
    { title: 'SURVIVOR SELECTION', desc: 'Elite protected replacement' },
  ];

  const hasHistory = data.history && data.history.length > 0;
  const isCompleted = data.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald">REAL HGS-CVRP ENGINE (VIDAL 2022)</Badge>
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/30 bg-emerald-950/40">
              <CheckCircle2 className="w-3 h-3 mr-1 inline" />
              Verified Classical Implementation
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Classical Optimization — Hybrid Genetic Search
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Live execution of the Vidal (2022) HGS-CVRP metaheuristic: combines giant-tour Order Crossover, Prins DP Split, and Variable Neighborhood Descent (2-Opt, Relocate, Swap).
          </p>
        </div>

        {/* Runtime KPIs */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">EXECUTION TIME</span>
            <span className="text-white font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {data.executionTimeMs ? `${data.executionTimeMs} ms` : 'Active'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">GENERATIONS</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              {data.generation} / {data.maxGenerations}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">BEST GENERATION</span>
            <span className="text-purple-300 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              #{data.bestGeneration ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Algorithmic Pipeline View */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Dna className="w-4 h-4" /> HGS ALGORITHMIC PIPELINE
          </span>
          <span className="text-xs font-mono text-slate-400">
            {isCompleted ? 'Status: Convergence Achieved' : 'Real Genetic Search'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {pipelineSteps.map((step, idx) => {
            const isHighlighted = idx === activeStep;
            return (
              <div
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-center transition-all duration-300 font-mono text-[11px] cursor-pointer ${
                  isHighlighted
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[9px] text-slate-500 font-bold mb-1">PHASE 0{idx + 1}</div>
                <div className="font-bold leading-tight mb-1">{step.title}</div>
                <div className="text-[9px] text-slate-500 leading-tight">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Population Solutions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.population.length > 0 ? (
          data.population.slice(0, 4).map((sol) => (
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
                    <Award className="w-3 h-3" /> BEST FEASIBLE
                  </span>
                )}
              </div>

              <div className="text-2xl font-extrabold text-white mb-1">
                {sol.distance} <span className="text-xs text-slate-400 font-normal">km</span>
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                <span>Vehicles Used:</span>
                <span className="text-purple-300 font-bold">{sol.vehicleCount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 p-4 text-center text-xs font-mono text-slate-500">
            Click &quot;Optimize with Classical HGS&quot; to execute search and populate candidate pool.
          </div>
        )}
      </div>

      {/* Real Convergence Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">HGS Convergence History</h3>
            <p className="text-xs text-slate-400 font-mono">
              Real monotonic Best Feasible Distance vs Population Average Distance across {data.generation} Generations
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Best Distance (Feasible)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Average Distance
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {hasHistory ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="generation" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  fontFamily="monospace"
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} km`,
                    name === 'bestDistance' ? 'Best Feasible' : 'Average',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="bestDistance"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="avgDistance"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
              Run optimization to view live convergence telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
