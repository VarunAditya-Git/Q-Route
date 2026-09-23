import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ProductPositioningBanner: React.FC = () => {
  return (
    <section className="py-12 bg-slate-950/80 border-y border-cyan-500/20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass-panel-glow p-8 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Badge variant="cyan">RESEARCH METHODOLOGY & DISTINCTION</Badge>
            </div>
            
            <p className="text-slate-300 font-medium text-sm md:text-base leading-relaxed">
              <span className="text-cyan-400 font-semibold">"We are not replacing classical optimization blindly."</span>
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              <strong className="text-white">Q-Route</strong> establishes a strong classical baseline using <span className="text-emerald-400 font-semibold">Hybrid Genetic Search (HGS)</span> and investigates whether <span className="text-purple-400 font-semibold">quantum optimization (QUBO / QAOA)</span> can provide useful improvements for selected routing formulations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
