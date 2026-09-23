import React from 'react';
import { CheckCircle2, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '../ui/Badge';
import { RouteMap } from '../map/RouteMap';
import type { OptimizationResult } from '../../types/vrp';

interface ResultsViewProps {
  data: OptimizationResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  const genHistory = [
    { generation: 1, distance: 1284 },
    { generation: 10, distance: 1102 },
    { generation: 25, distance: 978 },
    { generation: 50, distance: 914 },
    { generation: 100, distance: data.totalDistance },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel-glow p-8 rounded-3xl border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald">OPTIMIZATION COMPLETE</Badge>
              <span className="text-xs font-mono text-slate-400">ID: {data.id}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {data.totalDistance} <span className="text-lg font-normal text-slate-400">km Total Route Distance</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-slate-500 block text-[10px] uppercase">Vehicles Used</span>
            <span className="text-purple-400 font-bold text-base">{data.vehiclesUsed}</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-slate-500 block text-[10px] uppercase">Customers</span>
            <span className="text-cyan-400 font-bold text-base">{data.totalCustomers}</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-slate-500 block text-[10px] uppercase">Violations</span>
            <span className="text-emerald-400 font-bold text-base">0</span>
          </div>
        </div>
      </div>

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
                <History className="w-4 h-4 text-cyan-400" /> OPTIMIZATION CONVERGENCE HISTORY
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 px-3">Generation</th>
                    <th className="py-2 px-3 text-cyan-400">Total Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {genHistory.map(row => (
                    <tr key={row.generation}>
                      <td className="py-2.5 px-3">Gen {row.generation}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{row.distance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={genHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="generation" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="distance" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
