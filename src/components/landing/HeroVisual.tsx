import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, Pause, RotateCcw } from 'lucide-react';

type StageType = 'initial' | 'crossing' | 'optimizing' | 'clean';

interface StageMeta {
  key: StageType;
  label: string;
  distance: number;
  efficiency: string;
  desc: string;
}

export const HeroVisual: React.FC<{ onLaunch?: () => void }> = () => {
  const stages: StageMeta[] = [
    { key: 'initial', label: 'INITIAL ROUTES', distance: 1284, efficiency: 'Baseline Inefficient', desc: 'Random customer sequence assignments' },
    { key: 'crossing', label: 'CROSSING ROUTES', distance: 1041, efficiency: '-18.9% Overlap', desc: 'Severe intersecting vehicle paths detected' },
    { key: 'optimizing', label: 'OPTIMIZATION', distance: 923, efficiency: '2-Opt & QAOA Active', desc: 'HGS crossover & quantum phase sampling' },
    { key: 'clean', label: 'CLEAN ROUTES', distance: 867, efficiency: '+32.4% Optimal', desc: 'Zero path crossings & constraint satisfied' },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStageIndex(prev => (prev + 1) % stages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const currentStage = stages[currentStageIndex];

  // Coordinates on a 500x420 canvas
  const depot = { x: 250, y: 210, label: 'DEPOT' };

  const nodes = [
    { id: 'C01', x: 110, y: 90, label: 'C01', demand: 4 },
    { id: 'C02', x: 230, y: 70, label: 'C02', demand: 3 },
    { id: 'C03', x: 380, y: 85, label: 'C03', demand: 5 },
    { id: 'C04', x: 440, y: 220, label: 'C04', demand: 2 },
    { id: 'C05', x: 390, y: 340, label: 'C05', demand: 4 },
    { id: 'C06', x: 250, y: 360, label: 'C06', demand: 6 },
    { id: 'C07', x: 90, y: 330, label: 'C07', demand: 3 },
    { id: 'C08', x: 70, y: 200, label: 'C08', demand: 4 },
  ];

  // Path definitions across the 4 stages for 3 vehicles (Cyan, Purple, Emerald)
  const initialPaths = [
    // Vehicle 1 (Cyan): crosses all the way from C01 to C05 then C03
    `M ${depot.x} ${depot.y} L ${nodes[0].x} ${nodes[0].y} L ${nodes[4].x} ${nodes[4].y} L ${nodes[2].x} ${nodes[2].y} L ${depot.x} ${depot.y}`,
    // Vehicle 2 (Purple): crosses from C07 to C02 to C06
    `M ${depot.x} ${depot.y} L ${nodes[6].x} ${nodes[6].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[5].x} ${nodes[5].y} L ${depot.x} ${depot.y}`,
    // Vehicle 3 (Emerald): crosses from C08 to C04
    `M ${depot.x} ${depot.y} L ${nodes[7].x} ${nodes[7].y} L ${nodes[3].x} ${nodes[3].y} L ${depot.x} ${depot.y}`,
  ];

  const crossingPaths = [
    // Vehicle 1: Tangled through center
    `M ${depot.x} ${depot.y} L ${nodes[0].x} ${nodes[0].y} L ${nodes[3].x} ${nodes[3].y} L ${nodes[6].x} ${nodes[6].y} L ${depot.x} ${depot.y}`,
    // Vehicle 2: Overlapping
    `M ${depot.x} ${depot.y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[4].x} ${nodes[4].y} L ${nodes[7].x} ${nodes[7].y} L ${depot.x} ${depot.y}`,
    // Vehicle 3: Crosses V1 and V2
    `M ${depot.x} ${depot.y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[5].x} ${nodes[5].y} L ${depot.x} ${depot.y}`,
  ];

  const optimizingPaths = [
    // Reorganizing with 2-opt
    `M ${depot.x} ${depot.y} L ${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[2].x} ${nodes[2].y} L ${depot.x} ${depot.y}`,
    `M ${depot.x} ${depot.y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[3].x} ${nodes[3].y} L ${nodes[4].x} ${nodes[4].y} L ${depot.x} ${depot.y}`,
    `M ${depot.x} ${depot.y} L ${nodes[5].x} ${nodes[5].y} L ${nodes[6].x} ${nodes[6].y} L ${nodes[7].x} ${nodes[7].y} L ${depot.x} ${depot.y}`,
  ];

  const cleanPaths = [
    // Vehicle 1 (North sector): Depot -> C01 -> C02 -> C03 -> Depot
    `M ${depot.x} ${depot.y} L ${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[2].x} ${nodes[2].y} L ${depot.x} ${depot.y}`,
    // Vehicle 2 (East/South sector): Depot -> C04 -> C05 -> C06 -> Depot
    `M ${depot.x} ${depot.y} L ${nodes[3].x} ${nodes[3].y} L ${nodes[4].x} ${nodes[4].y} L ${nodes[5].x} ${nodes[5].y} L ${depot.x} ${depot.y}`,
    // Vehicle 3 (West sector): Depot -> C07 -> C08 -> Depot
    `M ${depot.x} ${depot.y} L ${nodes[6].x} ${nodes[6].y} L ${nodes[7].x} ${nodes[7].y} L ${depot.x} ${depot.y}`,
  ];

  const vehicleStyles = [
    { color: '#06b6d4', glow: 'rgba(6,182,212,0.4)', dot: '#38bdf8' },
    { color: '#a855f7', glow: 'rgba(168,85,247,0.4)', dot: '#c084fc' },
    { color: '#10b981', glow: 'rgba(16,185,129,0.4)', dot: '#34d399' },
  ];

  let currentPaths = initialPaths;
  if (currentStage.key === 'crossing') currentPaths = crossingPaths;
  else if (currentStage.key === 'optimizing') currentPaths = optimizingPaths;
  else if (currentStage.key === 'clean') currentPaths = cleanPaths;

  return (
    <div className="relative w-full h-[520px] rounded-3xl glass-panel-glow border border-cyan-500/30 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
      {/* Top Bar with Stage Pills */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {stages.map((stg, idx) => {
            const isActive = currentStageIndex === idx;
            return (
              <button
                key={stg.key}
                onClick={() => {
                  setCurrentStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                0{idx + 1} {stg.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? "Pause auto-loop" : "Play auto-loop"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />}
          </button>
          <button
            onClick={() => {
              setCurrentStageIndex(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to Initial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[360px] my-auto">
        <svg className="w-full h-full" viewBox="0 0 500 420" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="route-glow-hero" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="hero-depot-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Coordinate Grid Ticks */}
          <g opacity="0.15">
            {[100, 200, 300, 400].map(x => (
              <line key={`x-${x}`} x1={x} y1="0" x2={x} y2="420" stroke="#38bdf8" strokeDasharray="3 6" />
            ))}
            {[100, 200, 300, 400].map(y => (
              <line key={`y-${y}`} x1="0" y1={y} x2="500" y2={y} stroke="#38bdf8" strokeDasharray="3 6" />
            ))}
          </g>

          {/* Vehicle Routes */}
          {currentPaths.map((pathStr, i) => {
            const style = vehicleStyles[i % vehicleStyles.length];
            const isClean = currentStage.key === 'clean';
            const isOptimizing = currentStage.key === 'optimizing';

            return (
              <g key={`path-${currentStage.key}-${i}`}>
                {/* Glow Path */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={isClean ? 3.5 : 2}
                  strokeDasharray={isOptimizing ? "6 5" : undefined}
                  strokeOpacity={isClean ? 0.85 : 0.45}
                  filter="url(#route-glow-hero)"
                  className="transition-all duration-700 ease-in-out"
                />

                {/* Core Path Line */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={isClean ? 2.5 : 1.5}
                  strokeOpacity={isClean ? 0.95 : 0.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-700 ease-in-out"
                />

                {/* Animated Light Particles */}
                <circle r={isClean ? 4.5 : 3.5} fill={style.dot} className="filter drop-shadow-[0_0_8px_currentColor]">
                  <animateMotion
                    path={pathStr}
                    dur={`${2.8 + i * 1.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Crossing Warning indicator in 'crossing' stage */}
          {currentStage.key === 'crossing' && (
            <g transform="translate(265, 175)">
              <circle r="14" fill="#f43f5e" fillOpacity="0.25" className="animate-ping" />
              <circle r="7" fill="#f43f5e" />
              <text x="12" y="4" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Intersection Overlap
              </text>
            </g>
          )}

          {/* Customer Nodes */}
          {nodes.map(n => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer group">
              <circle r="13" fill="#0b1329" stroke="#38bdf8" strokeWidth="1.5" className="group-hover:stroke-cyan-300 transition-colors" />
              <circle r="5" fill="#06b6d4" fillOpacity="0.8" />
              <text y="-16" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="monospace">
                {n.label}
              </text>
              <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">
                {n.demand}
              </text>
            </g>
          ))}

          {/* Central Depot Node */}
          <g transform={`translate(${depot.x}, ${depot.y})`}>
            <circle r="36" fill="url(#hero-depot-pulse)" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle r="22" fill="#090d16" stroke="#06b6d4" strokeWidth="2.5" />
            <rect x="-9" y="-9" width="18" height="18" rx="3.5" fill="#06b6d4" />
            <text y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800" fontFamily="monospace" letterSpacing="0.08em">
              DEPOT
            </text>
          </g>
        </svg>
      </div>

      {/* Floating Simulated Metric Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-3.5 rounded-2xl border border-cyan-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase text-[11px]">{currentStage.label}</span>
                <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                  Simulation
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{currentStage.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:border-l sm:border-slate-800 sm:pl-5 text-right">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Total Distance</span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {currentStage.distance.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">km</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Efficiency</span>
              <span className={`font-bold ${currentStage.key === 'clean' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentStage.efficiency}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

