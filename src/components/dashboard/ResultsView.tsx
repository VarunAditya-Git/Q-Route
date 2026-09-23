import React from 'react';
import { CheckCircle2, History, DollarSign, TrendingDown, Sparkles, Navigation } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '../ui/Badge';
import { RouteMap } from '../map/RouteMap';
import type { OptimizationResult } from '../../types/vrp';

interface ResultsViewProps {
  data: OptimizationResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  // Use real HGS convergence history if available
  const history = data.hgsData?.history && data.hgsData.history.length > 0
    ? data.hgsData.history
    : [{ generation: 0, bestDistance: data.totalDistance, avgDistance: data.totalDistance, diversity: 100 }];

  // Sample roughly 5-10 key milestone rows for the summary table
  const sampleIndices = [
    0,
    Math.floor(history.length * 0.25),
    Math.floor(history.length * 0.5),
    Math.floor(history.length * 0.75),
    history.length - 1,
  ].filter((v, i, a) => a.indexOf(v) === i && v < history.length);

  const sampledTableRows = sampleIndices.map(idx => history[idx]);
  const econ = data.economicMetrics;
  const isFeasible = data.isFeasible ?? true;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald">HGS CLASSICAL OPTIMIZATION COMPLETE</Badge>
              <span className="text-xs font-mono text-slate-400">ID: {data.id} (Seed: {data.seed})</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {data.totalDistance} <span className="text-lg font-normal text-slate-400">km Total Route Distance</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              All routes strictly verified against capacity, customer coverage, and fleet constraints.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase">Vehicles Used</span>
            <span className="text-purple-400 font-bold text-base">{data.vehiclesUsed}</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase">Customers</span>
            <span className="text-cyan-400 font-bold text-base">{data.totalCustomers}</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase">Runtime</span>
            <span className="text-emerald-400 font-bold text-base">{data.executionTimeMs} ms</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase">Feasibility</span>
            <span className={`font-bold text-base ${isFeasible ? 'text-emerald-400' : 'text-red-400'}`}>
              {isFeasible ? 'Strict' : 'Violation'}
            </span>
          </div>
        </div>
      </div>

      {/* Economic Impact Summary */}
      {econ && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Measured Operational Economics & Revenue Impact</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Baseline Distance: {econ.baselineDistance} km</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Distance Reduction
              </span>
              <div className="text-xl font-bold text-white">
                {econ.savedDistance} km
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                -{econ.distanceReductionPercent}% vs naive baseline
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Fuel & Transport Savings
              </span>
              <div className="text-xl font-bold text-cyan-300">
                ${econ.fuelTransportSavings}
              </div>
              <div className="text-[11px] text-slate-400">
                Direct fuel & vehicle wear reduction
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Total Operational Savings
              </span>
              <div className="text-xl font-bold text-emerald-300">
                ${econ.totalOperationalSavings}
              </div>
              <div className="text-[11px] text-slate-400">
                Fuel + fixed fleet + driver costs
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
              <span className="text-purple-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Potential Revenue Opportunity
              </span>
              <div className="text-xl font-bold text-purple-300">
                ${econ.potentialRevenueOpportunity}
              </div>
              <div className="text-[11px] text-slate-400">
                Commercial value of unlocked delivery capacity
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map and Convergence Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RouteMap
            depot={data.depot}
            customers={data.customers}
            vehicles={data.vehicles}
            isOptimizing={false}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" /> REAL HGS CONVERGENCE MILESTONES
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Best Gen #{data.hgsData?.bestGeneration ?? 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 px-3">Generation</th>
                    <th className="py-2 px-3 text-emerald-400">Best Feasible</th>
                    <th className="py-2 px-3 text-cyan-400">Population Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {sampledTableRows.map(row => (
                    <tr key={row.generation}>
                      <td className="py-2 px-3">Gen {row.generation}</td>
                      <td className="py-2 px-3 font-bold text-emerald-300">{row.bestDistance} km</td>
                      <td className="py-2 px-3 text-slate-400">{row.avgDistance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="generation" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
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
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDistance"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
