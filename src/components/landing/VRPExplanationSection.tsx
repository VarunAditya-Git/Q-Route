import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Cpu, Sparkles, Network } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const VRPExplanationSection: React.FC = () => {
  const [customerScale, setCustomerScale] = useState<10 | 20 | 50>(10);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  const sampleRoutes = [
    { name: 'Route A', sequence: 'Depot → C1 → C4 → C3 → C2 → Depot', cost: '1,120 km', status: 'Sub-optimal' },
    { name: 'Route B', sequence: 'Depot → C2 → C5 → C1 → C4 → Depot', cost: '1,085 km', status: 'Crossing' },
    { name: 'Route C', sequence: 'Depot → C3 → C1 → C5 → C2 → Depot', cost: '990 km', status: 'Feasible' },
    { name: 'Route D', sequence: 'Depot → C4 → C2 → C3 → C5 → Depot', cost: '1,195 km', status: 'Inefficient' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRouteIndex(prev => (prev + 1) % sampleRoutes.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [sampleRoutes.length]);

  const scaleData = {
    10: {
      headline: 'Thousands of Combinations',
      approx: 'Over 3.6 Million Route Orders',
      calc: '10! / 2 ≈ 1.8 × 10⁶ symmetrical permutations',
      feasibility: 'Tractable with classical exact algorithms',
    },
    20: {
      headline: 'Millions+ Combinations',
      approx: 'Over 2.4 Quintillion Route Orders',
      calc: '20! / 2 ≈ 1.2 × 10¹⁸ permutations',
      feasibility: 'Exhaustive search fails; metaheuristics required',
    },
    50: {
      headline: '10⁶⁴ Combinations',
      approx: 'Exceeds Atoms in Known Universe',
      calc: '50! ≈ 3.04 × 10⁶⁴ permutations',
      feasibility: 'Pure combinatorial explosion; heuristic & quantum domain',
    },
  };

  // Generate faint background combinatorial web lines between 6 points
  const points = [
    { x: 50, y: 70 },
    { x: 190, y: 40 },
    { x: 330, y: 60 },
    { x: 380, y: 170 },
    { x: 260, y: 220 },
    { x: 100, y: 200 },
  ];

  return (
    <section id="why-vrp" className="py-24 relative overflow-hidden border-t border-slate-800/80 bg-[#040817]/70">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" icon={<Network className="w-3.5 h-3.5" />} className="mb-4">
            COMBINATORIAL EXPLOSION
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Why is Vehicle Routing Difficult?
          </h2>
          <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 max-w-2xl mx-auto text-center">
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              <span className="text-white font-medium">"Finding a good route is easy.</span> <br />
              <span className="text-cyan-300 font-semibold">Finding the best route among an enormous number of possible combinations is the real problem."</span>
            </p>
          </div>
        </div>

        {/* 4-Level Problem Decomposition Pipeline: DEPOT ↓ CUSTOMERS ↓ VEHICLES ↓ ROUTES */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 mb-10 max-w-4xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold mb-4 text-center">
            THE 4 LEVELS OF COMBINATORIAL COMPLEXITY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-cyan-400 font-bold text-sm">DEPOT</span>
              <span className="text-[10px] text-slate-500 mt-1">Origin & Return Anchor</span>
              <ArrowDown className="w-4 h-4 text-slate-600 mt-2 sm:hidden" />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-purple-300 font-bold text-sm">CUSTOMERS</span>
              <span className="text-[10px] text-slate-500 mt-1">Individual Demands $q_i$</span>
              <ArrowDown className="w-4 h-4 text-slate-600 mt-2 sm:hidden" />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-emerald-400 font-bold text-sm">VEHICLES</span>
              <span className="text-[10px] text-slate-500 mt-1">Fleet Partitioning & Capacity $Q$</span>
              <ArrowDown className="w-4 h-4 text-slate-600 mt-2 sm:hidden" />
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="text-cyan-300 font-bold text-sm">ROUTES</span>
              <span className="text-[10px] text-cyan-400/80 mt-1">NP-Hard Sequence Space</span>
            </div>
          </div>
        </div>

        {/* Interactive Comparison & Visual Web */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Panel: Animated rapid permutation sampler with faint background spidering paths */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> RAPID ROUTE SAMPLING PREVIEW
              </span>
              <span className="text-[11px] font-mono text-slate-500">Cycling Candidates</span>
            </div>

            {/* Faint Combinatorial Route Web Background SVG */}
            <div className="relative w-full h-64 bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 440 260">
                {/* Spidering dozens of faint candidate paths */}
                {points.map((p1, i) =>
                  points.map((p2, j) => {
                    if (i >= j) return null;
                    return (
                      <line
                        key={`web-${i}-${j}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#a855f7"
                        strokeWidth="1"
                        strokeOpacity="0.12"
                        strokeDasharray="4 4"
                      />
                    );
                  })
                )}

                {/* Highlight Active Candidate Path */}
                {points.slice(0, -1).map((pt, idx) => (
                  <line
                    key={`active-edge-${idx}`}
                    x1={pt.x}
                    y1={pt.y}
                    x2={points[(idx + 1) % points.length].x}
                    y2={points[(idx + 1) % points.length].y}
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                    strokeDasharray="6 3"
                    className="transition-all duration-500"
                  />
                ))}

                {/* Nodes */}
                {points.map((pt, idx) => (
                  <g key={`pt-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
                    <circle r="9" fill="#030712" stroke={idx === 0 ? "#06b6d4" : "#a855f7"} strokeWidth="2" />
                    <text y="3" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      {idx === 0 ? 'D' : `C${idx}`}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Active candidate card overlay */}
              <div className="z-10 w-full max-w-md glass-panel p-4 rounded-xl border border-cyan-500/40 text-xs font-mono shadow-2xl">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold uppercase">{sampleRoutes[activeRouteIndex].name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    Est. Cost: {sampleRoutes[activeRouteIndex].cost}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRouteIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-white font-bold tracking-wide text-sm py-1"
                  >
                    {sampleRoutes[activeRouteIndex].sequence}
                  </motion.div>
                </AnimatePresence>
                <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                  <span>Status: {sampleRoutes[activeRouteIndex].status}</span>
                  <span className="text-cyan-400">Thousands of possible solutions</span>
                </div>
              </div>
            </div>

            {/* Quick list of faint permutations */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mt-4 opacity-60">
              {sampleRoutes.map((r, i) => (
                <div
                  key={r.name}
                  className={`p-2 rounded-lg border transition-all ${
                    activeRouteIndex === i ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold">{r.name}:</span> {r.sequence.replace(/ → /g, '→')}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Combinatorial Explosion Counter */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Select Customer Scale:</span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                  Search Space Calculator
                </span>
              </div>

              {/* Selector Buttons */}
              <div className="grid grid-cols-3 gap-2 my-4">
                {([10, 20, 50] as const).map(count => (
                  <button
                    key={count}
                    onClick={() => setCustomerScale(count)}
                    className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                      customerScale === count
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {count} Customers
                  </button>
                ))}
              </div>

              {/* Animated Search Space Metric Card */}
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center relative overflow-hidden">
                <span className="text-xs text-slate-500 font-mono uppercase block mb-1">Search Space Size</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={customerScale}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="text-3xl sm:text-4xl font-extrabold text-gradient-quantum font-mono mb-2"
                  >
                    {scaleData[customerScale].headline}
                  </motion.div>
                </AnimatePresence>

                <div className="text-xs text-slate-300 font-mono font-medium mb-1">
                  {scaleData[customerScale].approx}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {scaleData[customerScale].calc}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-mono flex items-center justify-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{scaleData[customerScale].feasibility}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

