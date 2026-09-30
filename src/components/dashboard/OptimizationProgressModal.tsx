import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Dna } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { OptimizationResult } from '../../types/vrp';

interface OptimizationProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: OptimizationResult;
  algorithm?: 'hgs' | 'qaoa';
}

export const OptimizationProgressModal: React.FC<OptimizationProgressModalProps> = ({
  isOpen,
  onClose,
  result,
  algorithm = 'qaoa',
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentDist, setCurrentDist] = useState(1284);

  const qaoaSteps = [
    { name: '1. VALIDATION', desc: 'Validating routing graph, node matrix & depot coordinates...', pct: 16 },
    { name: '2. QUBO & ISING', desc: 'Building Quadratic Unconstrained Binary Optimization & spin Hamiltonian...', pct: 33 },
    { name: '3. QAOA CIRCUIT', desc: 'Constructing parameterized quantum ansatz circuit U(γ, β)...', pct: 50 },
    { name: '4. OPTIMIZER TUNING', desc: 'Executing classical parameter optimizer (SPSA/COBYLA) for (β, γ)...', pct: 66 },
    { name: '5. QUANTUM EXECUTION', desc: 'Sampling measurement probability distribution over statevector...', pct: 83 },
    { name: '6. FEASIBILITY & ROUTE', desc: 'Decoding bitstrings, verifying constraints & locking optimal route...', pct: 100 },
  ];

  const hgsSteps = [
    { name: 'INITIALIZATION', desc: 'Generating spatial node graph & initial crossing routes...', pct: 25 },
    { name: 'POPULATION SEARCH', desc: 'Running Hybrid Genetic Search population crossover...', pct: 50 },
    { name: 'LOCAL IMPROVEMENT', desc: 'Executing 2-opt local search & neighborhood exploration...', pct: 75 },
    { name: 'FINALIZATION', desc: 'Locking optimal vehicle routes & verifying constraints...', pct: 100 },
  ];

  const steps = algorithm === 'qaoa' ? qaoaSteps : hgsSteps;

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setCurrentDist(1284);
      return;
    }

    const distValues = algorithm === 'qaoa'
      ? [1284, 1150, 1020, 960, 890, result.totalDistance]
      : [1284, 1041, 914, result.totalDistance];

    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setStepIndex(idx);
        setCurrentDist(distValues[Math.min(idx, distValues.length - 1)]);
      } else {
        clearInterval(interval);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen, result.totalDistance, algorithm, steps.length]);

  if (!isOpen) return null;

  const currentStep = steps[stepIndex];
  const isFinished = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl glass-panel-glow p-8 rounded-3xl border border-purple-500/40 shadow-2xl relative overflow-hidden font-mono"
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400 animate-spin" />
            <span className="font-bold text-white text-base flex items-center gap-2">
              {algorithm === 'qaoa' ? (
                <>
                  <Cpu className="w-4 h-4 text-purple-400" /> QAOA ROUTING SERVICE PIPELINE
                </>
              ) : (
                <>
                  <Dna className="w-4 h-4 text-emerald-400" /> HGS BASELINE OPTIMIZER
                </>
              )}
            </span>
          </div>
          <Badge variant={algorithm === 'qaoa' ? 'purple' : 'cyan'}>
            {algorithm === 'qaoa' ? 'QAOA Active' : 'HGS Active'}
          </Badge>
        </div>

        <div className="my-6 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center relative overflow-hidden">
          <span className="text-xs text-slate-500 block uppercase mb-1">
            {algorithm === 'qaoa' ? 'QAOA Objective Energy Optimization' : 'Simulated Distance Optimization'}
          </span>
          <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {currentDist.toLocaleString()} <span className="text-base text-slate-400 font-normal">km</span>
          </div>
          <div className="text-xs text-purple-300 font-bold mt-2">
            {isFinished ? '✓ Feasible QAOA Route Locked' : `Step ${stepIndex + 1}/${steps.length}: ${currentStep.name}`}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{currentStep.name}</span>
            <span>{currentStep.pct}%</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <motion.div
              className="bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-400 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${currentStep.pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-[11px] text-slate-400 italic pt-1">{currentStep.desc}</p>
        </div>

        <div className={`grid ${algorithm === 'qaoa' ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4'} gap-1.5 text-[9px] text-center mb-6`}>
          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`p-2 rounded-lg border transition-all ${
                i <= stepIndex
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40 font-bold'
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
                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
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
