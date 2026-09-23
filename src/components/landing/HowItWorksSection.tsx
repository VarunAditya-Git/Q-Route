import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Dna, Cpu, BarChart3 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  const steps = [
    {
      id: 1,
      title: 'Model',
      subtitle: 'Problem Formulation',
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      badge: 'INPUT MATRIX',
    },
    {
      id: 2,
      title: 'Classical Search',
      subtitle: 'Hybrid Genetic Search',
      icon: <Dna className="w-5 h-5 text-emerald-400" />,
      badge: 'HGS BASELINE',
    },
    {
      id: 3,
      title: 'Quantum Optimization',
      subtitle: 'QUBO & QAOA Solver',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      badge: 'RESEARCH MODULE',
    },
    {
      id: 4,
      title: 'Compare',
      subtitle: 'Benchmark Analysis',
      icon: <BarChart3 className="w-5 h-5 text-amber-400" />,
      badge: 'PERFORMANCE EVAL',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-slate-950/70 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="cyan" className="mb-4">
            HYBRID PIPELINE ARCHITECTURE
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Q-Route Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A 4-step hybrid framework bridging classical metaheuristics and experimental quantum algorithms.
          </p>
        </div>

        {/* Step Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-10">
          {steps.map(s => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id as 1 | 2 | 3 | 4)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">{s.icon}</div>
                  <span className="text-xs font-mono font-bold text-slate-500">0{s.id}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">{s.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{s.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Details Canvas */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 min-h-[360px] shadow-2xl">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <Badge variant="cyan">STEP 01: MODEL FORMULATION</Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Problem Inputs & Constraints</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The logistics problem is converted into a formal graph definition with demand vectors, fleet parameters, and hard constraints.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-cyan-400 font-bold block mb-0.5">Customers</span>
                      <span className="text-slate-400 text-[11px]">Demand points ($q_i$)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-purple-400 font-bold block mb-0.5">Vehicles</span>
                      <span className="text-slate-400 text-[11px]">Fleet size ($K$)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-emerald-400 font-bold block mb-0.5">Capacity</span>
                      <span className="text-slate-400 text-[11px]">Max payload ($Q$)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-amber-400 font-bold block mb-0.5">Distances</span>
                      <span className="text-slate-400 text-[11px]">Cost matrix ($d_{"ij"}$)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-cyan-300 font-bold">Constraints:</span> Visit every customer exactly once • Vehicle capacity limit • All routes start & end at Central Depot.
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs shadow-inner">
                  <div className="text-slate-500 text-[10px] uppercase mb-2">// Canonical VRP Problem Instance Payload</div>
                  <pre className="text-cyan-300 overflow-x-auto leading-relaxed">
{`{
  "depot": { "x": 500, "y": 500 },
  "customers": [
    { "id": "C01", "coords": [180, 220], "demand": 4 },
    { "id": "C02", "coords": [320, 140], "demand": 6 },
    ... 48 additional nodes ...
  ],
  "fleet": { "count": 5, "capacity": 40 },
  "constraints": {
    "visit_once": true,
    "capacity_bound": 40,
    "start_end_depot": true
  }
}`}
                  </pre>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <Badge variant="emerald">STEP 02: CLASSICAL SEARCH</Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Hybrid Genetic Search (HGS)</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    HGS pairs genetic population evolution with aggressive local improvement heuristics to rapidly prune sub-optimal crossings.
                  </p>
                  
                  {/* Step pipeline: Multiple candidate routes -> Selection -> Crossover -> Local Search -> Improved routes */}
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { step: 'Multiple candidate routes', desc: 'Generate diverse initial random population pool' },
                      { step: 'Selection', desc: 'Binary tournament prioritizing low distance & high diversity' },
                      { step: 'Crossover (OX / Ordered)', desc: 'Combine sub-tours from parent chromosomes' },
                      { step: 'Local Search (2-Opt / Swap)', desc: 'Aggressive edge-exchange uncrossing heuristics' },
                      { step: 'Improved routes', desc: 'Filter into survivor population with elite preservation' },
                    ].map((item, idx) => (
                      <div key={item.step} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{item.step}</div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-4">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>HGS Metaheuristic Engine</span>
                    <span>100 Generations</span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Convergence Progress:</span>
                      <span className="text-emerald-400 font-bold">Generation 100/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[95%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block uppercase text-[9px]">Initial Distance</span>
                      <span className="text-base font-bold text-white">1,284 km</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block uppercase text-[9px]">HGS Best Distance</span>
                      <span className="text-base font-bold text-emerald-400">742 km (-42.2%)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="purple">STEP 03: QUANTUM OPTIMIZATION</Badge>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40 font-bold">
                      Research / Experimental Module
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">QUBO & QAOA Circuit Formulation</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Translates the constrained VRP into Quadratic Unconstrained Binary Optimization (QUBO) matrices solved via Quantum Approximate Optimization Algorithm (QAOA).
                  </p>

                  {/* Step pipeline: VRP -> Mathematical Formulation -> QUBO -> Quantum Optimization -> Candidate Solutions */}
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    {[
                      { step: 'VRP Graph Instance', desc: 'Spatial coordinate plane & constraints' },
                      { step: 'Mathematical Formulation', desc: 'Binary decision variables $x_{"ijk"} \\in \\{0,1\\}$' },
                      { step: 'QUBO Matrix Translation', desc: 'Cost Hamiltonian + Quadratic penalty terms' },
                      { step: 'Quantum Circuit Optimization', desc: 'Parameterized ansatz rotation layers $\\gamma, \\beta$' },
                      { step: 'Candidate Solutions', desc: 'Measure quantum states with highest probability' },
                    ].map((item, idx) => (
                      <div key={item.step} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-purple-200">{item.step}</div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-4">
                  <div className="flex items-center justify-between text-purple-400 font-bold">
                    <span>QUBO Objective Formulation</span>
                    <span className="text-[10px] text-slate-500">QAOA Hamiltonian</span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 text-xs leading-relaxed space-y-2">
                    <div className="text-[10px] text-slate-500">// Hamiltonian Objective Function</div>
                    <div>{"$H(\\mathbf{x}) = \\sum_{ij} Q_{ij} x_i x_j + \\lambda_1 P_1(\\mathbf{x}) + \\lambda_2 P_2(\\mathbf{x})$"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Logical Qubits</span>
                      <span className="font-bold text-purple-300">12 Qubits</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Circuit Depth</span>
                      <span className="font-bold text-purple-300">18 Gates</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Optimization Shots</span>
                      <span className="font-bold text-emerald-400">1024 Shots</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Target Backend</span>
                      <span className="font-bold text-cyan-400">IBM Quantum Aer</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <Badge variant="amber">STEP 04: BENCHMARK COMPARISON</Badge>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Classical HGS vs Quantum / Hybrid</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Systematic benchmarking of solution quality, runtime overhead, and constraint fulfillment across classical and quantum solvers.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400">
                    Q-Route maintains strict empirical discipline: classical metaheuristics are benchmarked side-by-side with quantum circuits to establish true comparative value.
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Total Distance</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-bold">HGS: 742 km</span>
                      <span className="text-purple-400 font-bold">QAOA: 728 km</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Vehicles Used</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-200">5 Vehicles</span>
                      <span className="text-slate-200">5 Vehicles</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Constraint Violations</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-bold">0 Violations</span>
                      <span className="text-emerald-400 font-bold">0 Violations</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Runtime</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300">2.8 s</span>
                      <span className="text-slate-300">4.6 s</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Solution Quality</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400">Baseline Optimal</span>
                      <span className="text-purple-300 font-bold">Experimental (-1.9%)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

