import React from 'react';
import { Play, Home, Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { ActiveTab } from '../../types/vrp';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onRunOptimization: () => void;
  onReturnHome: () => void;
  isOptimizing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRunOptimization,
  onReturnHome,
  isOptimizing,
}) => {
  return (
    <header className="h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onReturnHome}
          className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight font-mono hover:text-cyan-400 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            Q
          </div>
          <span>Q-Route</span>
        </button>

        <div className="hidden md:block text-xs font-mono text-slate-400 pl-3 border-l border-slate-800">
          Quantum-Enhanced Vehicle Routing Optimization
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="emerald" icon={<Activity className="w-3.5 h-3.5" />}>
          Classical HGS Engine
        </Badge>

        <button
          onClick={onReturnHome}
          className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Return to Landing Page"
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            isOptimizing
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'RUNNING SOLVER...' : 'RUN OPTIMIZATION'}</span>
        </button>
      </div>
    </header>
  );
};
