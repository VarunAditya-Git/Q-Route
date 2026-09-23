import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface LandingCTAProps {
  onLaunch: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onLaunch }) => {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-950 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-panel-glow p-10 md:p-14 rounded-3xl border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <Badge variant="cyan" className="mb-4">
            QUANTUM & CLASSICAL VRP ENGINE
          </Badge>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to optimize the route?
          </h2>

          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Test routing constraints, evaluate Hybrid Genetic Search baselines, and preview experimental QAOA quantum formulations.
          </p>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onLaunch}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.5)] flex items-center gap-3 font-mono cursor-pointer transform hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              <span>Launch Q-Route</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <span className="text-xs text-slate-400 font-mono tracking-wide pt-2">
              Classical baseline. Quantum exploration. One optimization problem.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
