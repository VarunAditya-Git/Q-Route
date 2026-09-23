import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Map, 
  Dna, 
  Cpu, 
  GitCompare, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import type { ActiveTab } from '../../types/vrp';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'setup', label: 'Problem Setup', icon: <Sliders className="w-4 h-4" /> },
    { id: 'map', label: 'Interactive Map', icon: <Map className="w-4 h-4" /> },
    { id: 'hgs', label: 'Classical HGS', icon: <Dna className="w-4 h-4" />, badge: 'Baseline' },
    { id: 'quantum', label: 'Quantum Optimizer', icon: <Cpu className="w-4 h-4" />, badge: 'QUBO' },
    { id: 'comparison', label: 'Comparison', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'results', label: 'Results', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'research', label: 'Research Mode', icon: <BookOpen className="w-4 h-4" />, badge: 'Theory' },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          SOLVER DASHBOARD
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="text-slate-200 font-bold mb-0.5">Q-Route v1.0 Prototype</div>
        <div className="text-cyan-400/80 text-[10px]">CVRP Benchmark Instance</div>
      </div>
    </aside>
  );
};
