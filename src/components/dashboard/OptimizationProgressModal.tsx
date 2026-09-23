import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { OptimizationResult } from '../../types/vrp';

interface OptimizationProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: OptimizationResult;
}

export const OptimizationProgressModal: React.FC<OptimizationProgressModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentDist, setCurrentDist] = useState(1284);

  const steps = [
    { name: 'INITIALIZATION', desc: 'Generating spatial node graph & initial crossing routes...', pct: 25 },
    { name: 'SEARCH', desc: 'Running Hybrid Genetic Search population crossover...', pct: 50 },
    { name: 'LOCAL IMPROVEMENT', desc: 'Executing 2-opt local search & QAOA quantum circuit sampling...', pct: 75 },
    { name: 'FINALIZATION', desc: 'Locking optimal vehicle routes & verifying constraints...', pct: 100 },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setCurrentDist(1284);
      return;
    }

    const distValues = [1284, 1041, 914, result.totalDistance];
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setStepIndex(idx);
        setCurrentDist(distValues[idx]);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen, result.totalDistance]);

  if (!isOpen) return null;

  const currentStep = steps[stepIndex];
  const isFinished = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl glass-panel-glow p-8 rounded-3xl border border-cyan-500/40 shadow-2xl relative overflow-hidden font-mono"
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="font-bold text-white text-base">HYBRID OPTIMIZATION RUNNER</span>
          </div>
          <Badge variant="simulation">Simulation Active</Badge>
        </div>

        <div className="my-6 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center relative overflow-hidden">
          <span className="text-xs text-slate-500 block uppercase mb-1">Simulated Distance Optimization</span>
          <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {currentDist.toLocaleString()} <span className="text-base text-slate-400 font-normal">km</span>
          </div>
          <div className="text-xs text-emerald-400 font-bold mt-2">
            {isFinished ? '✓ Optimal Path Locked' : `Step ${stepIndex + 1}/4: ${currentStep.name}`}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{currentStep.name}</span>
            <span>{currentStep.pct}%</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${currentStep.pct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 italic pt-1">{currentStep.desc}</p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center mb-6">
          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`p-2 rounded-lg border transition-all ${
                i <= stepIndex
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800'
              }`}
            >
              {s.name}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={!isFinished}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              isFinished
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isFinished ? 'VIEW RESULTS' : 'OPTIMIZING...'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
