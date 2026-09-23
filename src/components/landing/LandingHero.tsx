import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, ChevronRight, PlayCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { HeroVisual } from './HeroVisual';

interface LandingHeroProps {
  onLaunch: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunch }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('why-vrp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background Quantum Gradient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2">
              <Badge variant="cyan" icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}>
                HYBRID QUANTUM OPTIMIZATION
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Optimizing the <br />
              <span className="text-gradient-quantum">Roads of Tomorrow.</span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
              Q-Route explores classical and quantum optimization techniques to solve complex Vehicle Routing Problems.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onLaunch}
                className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center gap-2 font-mono group cursor-pointer"
              >
                <Rocket className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Explore Optimization</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="px-7 py-3.5 rounded-xl glass-card hover:bg-slate-800/80 text-slate-200 font-semibold text-sm transition-all duration-200 border border-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>See How It Works</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Hybrid Genetic Search
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                QUBO / QAOA Module
              </span>
            </div>
          </motion.div>

          {/* Hero Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <HeroVisual onLaunch={onLaunch} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
