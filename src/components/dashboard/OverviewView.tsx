import React from 'react';
import { Users, Truck, Package, Scale, Navigation, Activity, ArrowRight, Play } from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { Badge } from '../ui/Badge';
import { RouteMap } from '../map/RouteMap';
import type { OptimizationResult, ActiveTab } from '../../types/vrp';

interface OverviewViewProps {
  data: OptimizationResult;
  onTabChange: (tab: ActiveTab) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  data,
  onTabChange,
  onRunOptimization,
  isOptimizing,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan">CONTROL CENTER</Badge>
            <span className="text-xs font-mono text-slate-400">ID: {data.id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            VRP Optimization Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure a routing problem, generate a classical baseline, and compare it with experimental quantum optimization.
          </p>
        </div>

        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-mono flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isOptimizing ? 'SOLVER RUNNING...' : 'LAUNCH SOLVER'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="CUSTOMERS"
          value={data.totalCustomers}
          unit="pts"
          subtitle="Locations"
          icon={<Users className="w-4 h-4" />}
          accentColor="cyan"
        />
        <MetricCard
          title="VEHICLES"
          value={data.vehiclesUsed}
          unit="fleet"
          subtitle="Assigned"
          icon={<Truck className="w-4 h-4" />}
          accentColor="purple"
        />
        <MetricCard
          title="TOTAL DEMAND"
          value={data.totalDemand}
          unit="units"
          subtitle="Cargo Load"
          icon={<Package className="w-4 h-4" />}
          accentColor="emerald"
        />
        <MetricCard
          title="VEHICLE CAPACITY"
          value={data.vehicleCapacity}
          unit="units/veh"
          subtitle="Max Payload"
          icon={<Scale className="w-4 h-4" />}
          accentColor="amber"
        />
        <MetricCard
          title="CURRENT BEST DISTANCE"
          value={data.totalDistance}
          unit="km"
          subtitle="Total Route"
          icon={<Navigation className="w-4 h-4" />}
          accentColor="cyan"
        />
        <MetricCard
          title="OPTIMIZATION STATUS"
          value={isOptimizing ? 'RUNNING' : (data.hgsData?.status === 'completed' ? 'OPTIMIZED' : 'BASELINE READY')}
          subtitle="Vidal (2022) HGS"
          icon={<Activity className="w-4 h-4" />}
          accentColor={isOptimizing ? 'amber' : 'emerald'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RouteMap
            depot={data.depot}
            customers={data.customers}
            vehicles={data.vehicles}
            isOptimizing={isOptimizing}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                ACTIVE VEHICLE FLEET ({data.vehicles.length})
              </span>
              <button
                onClick={() => onTabChange('map')}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Expand Map <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {data.vehicles.map(veh => {
                const loadPercent = Math.min(100, Math.round((veh.currentLoad / veh.capacity) * 100));
                return (
                  <div
                    key={veh.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: veh.color }} />
                        <div>
                          <div className="text-white font-bold">{veh.name}</div>
                          <div className="text-slate-500 text-[10px]">{veh.routeNodeIds.length} customer stops</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-cyan-300 font-bold">{veh.totalDistance} km</div>
                        <div className="text-slate-400 text-[10px]">
                          Load: {veh.currentLoad}/{veh.capacity} ({loadPercent}%)
                        </div>
                      </div>
                    </div>

                    {/* Capacity Load Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${loadPercent}%`,
                          backgroundColor: veh.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
