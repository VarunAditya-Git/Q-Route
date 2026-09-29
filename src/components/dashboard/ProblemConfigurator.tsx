import React, { useState } from 'react';
import { Sliders, RefreshCw, Target, Cpu, Dna } from 'lucide-react';
import type { VRPProblemConfig, DistributionType, OptimizationObjective } from '../../types/vrp';
import { Badge } from '../ui/Badge';

interface ProblemConfiguratorProps {
  config: VRPProblemConfig;
  onUpdateConfig: (newConfig: VRPProblemConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ProblemConfigurator: React.FC<ProblemConfiguratorProps> = ({
  config,
  onUpdateConfig,
  onGenerate,
  isGenerating,
}) => {
  const [localConfig, setLocalConfig] = useState<VRPProblemConfig>(config);

  const handleSlider = (field: keyof VRPProblemConfig, val: number) => {
    const updated = { ...localConfig, [field]: val };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleQAOASetting = (key: keyof VRPProblemConfig['qaoaSettings'], val: any) => {
    const updated: VRPProblemConfig = {
      ...localConfig,
      qaoaSettings: {
        ...localConfig.qaoaSettings,
        [key]: val,
      },
    };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleConstraint = (key: keyof VRPProblemConfig['constraints']) => {
    const updated = {
      ...localConfig,
      constraints: {
        ...localConfig.constraints,
        [key]: !localConfig.constraints[key],
      },
    };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
        <div>
          <Badge variant="cyan" className="mb-1">PROBLEM CONFIGURATOR</Badge>
          <h1 className="text-2xl font-extrabold text-white">VRP Problem Setup</h1>
          <p className="text-slate-400 text-sm">
            Customize node spatial distributions, vehicle capacities, optimization algorithm, and QAOA parameters.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Generate Problem</span>
        </button>
      </div>

      {/* Algorithm Selector Card */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> CHOOSE OPTIMIZATION SERVICE ALGORITHM
          </span>
          <Badge variant="purple">First-Class Solver Choice</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              const updated = { ...localConfig, selectedAlgorithm: 'qaoa' as const };
              setLocalConfig(updated);
              onUpdateConfig(updated);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              localConfig.selectedAlgorithm === 'qaoa'
                ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-purple-300">
              <Cpu className="w-4 h-4" /> QAOA Routing Service (Quantum)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              QAOA hybrid quantum-classical optimization with QUBO formulation, Ising Hamiltonian mapping, and statevector sampling.
            </p>
          </div>

          <div
            onClick={() => {
              const updated = { ...localConfig, selectedAlgorithm: 'hgs' as const };
              setLocalConfig(updated);
              onUpdateConfig(updated);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              localConfig.selectedAlgorithm === 'hgs'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
              <Dna className="w-4 h-4" /> Hybrid Genetic Search (HGS Baseline)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Classical population-based metaheuristic algorithm optimized for large scale vehicle routing benchmark instances.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Problem Parameters</span>
          </h2>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Number of Customers ($N$)</span>
              <span className="text-cyan-400 font-bold text-sm">{localConfig.customerCount}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={localConfig.customerCount}
              onChange={e => handleSlider('customerCount', parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 (Small)</span>
              <span>50 (Benchmark)</span>
              <span>100 (Large)</span>
            </div>
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Number of Fleet Vehicles ($K$)</span>
              <span className="text-purple-400 font-bold text-sm">{localConfig.vehicleCount}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={localConfig.vehicleCount}
              onChange={e => handleSlider('vehicleCount', parseInt(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Vehicle Capacity Limit ($Q$)</span>
              <span className="text-emerald-400 font-bold text-sm">{localConfig.vehicleCapacity} units</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={localConfig.vehicleCapacity}
              onChange={e => handleSlider('vehicleCapacity', parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2 font-mono">
            <span className="text-xs text-slate-400 block">Customer Spatial Distribution</span>
            <div className="grid grid-cols-2 gap-2">
              {(['clustered', 'random', 'radial', 'grid'] as DistributionType[]).map(dist => (
                <button
                  key={dist}
                  onClick={() => {
                    const updated = { ...localConfig, distribution: dist };
                    setLocalConfig(updated);
                    onUpdateConfig(updated);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    localConfig.distribution === dist
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QAOA Parameters Panel if QAOA selected */}
        {localConfig.selectedAlgorithm === 'qaoa' ? (
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>QAOA Hyperparameters</span>
            </h2>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">QAOA Layers ($p$)</span>
                <span className="text-purple-400 font-bold text-sm">{localConfig.qaoaSettings.pLayers} Layers</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={localConfig.qaoaSettings.pLayers}
                onChange={e => handleQAOASetting('pLayers', parseInt(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Measurement Shots</span>
                <span className="text-emerald-400 font-bold text-sm">{localConfig.qaoaSettings.shots}</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={localConfig.qaoaSettings.shots}
                onChange={e => handleQAOASetting('shots', parseInt(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Classical Optimizer</span>
                <select
                  value={localConfig.qaoaSettings.optimizer}
                  onChange={e => handleQAOASetting('optimizer', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2 font-mono cursor-pointer"
                >
                  <option value="SPSA">SPSA</option>
                  <option value="COBYLA">COBYLA</option>
                  <option value="ADAM">ADAM</option>
                </select>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Execution Backend</span>
                <select
                  value={localConfig.qaoaSettings.backend}
                  onChange={e => handleQAOASetting('backend', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2 font-mono cursor-pointer"
                >
                  <option value="statevector">Statevector Simulator</option>
                  <option value="aer_simulator">Aer Simulator (Shot Noise)</option>
                  <option value="ibm_sherbrooke">IBM Sherbrooke (Hardware)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 font-mono pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Constraint Penalty $P_A$ (Uniqueness)</span>
                <span className="text-cyan-400 font-bold">{localConfig.qaoaSettings.penaltyA}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={localConfig.qaoaSettings.penaltyA}
                onChange={e => handleQAOASetting('penaltyA', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Target className="w-4 h-4 text-purple-400" />
              <span>Optimization Objective & Constraints</span>
            </h2>

            <div className="space-y-2 font-mono">
              <span className="text-xs text-slate-400 block">Primary Objective Function</span>
              <div className="space-y-2">
                {[
                  { id: 'distance', label: 'Minimize Distance', desc: 'Focus strictly on total travel km' },
                  { id: 'cost', label: 'Minimize Operational Cost', desc: 'Factor distance + vehicle fixed costs' },
                  { id: 'vehicles', label: 'Minimize Vehicle Fleet', desc: 'Use fewest vehicles possible' },
                  { id: 'balanced', label: 'Balanced Objective', desc: 'Multi-objective Pareto trade-off' },
                ].map(obj => (
                  <div
                    key={obj.id}
                    onClick={() => {
                      const updated = { ...localConfig, objective: obj.id as OptimizationObjective };
                      setLocalConfig(updated);
                      onUpdateConfig(updated);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      localConfig.objective === obj.id
                        ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{obj.label}</div>
                    <div className="text-[10px] text-slate-500">{obj.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 font-mono pt-2">
              <span className="text-xs text-slate-400 block">Hard Mathematical Constraints</span>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'visitOnce', label: 'Every customer visited exactly once' },
                  { key: 'capacityCheck', label: 'Vehicle total load ≤ Capacity limit ($Q$)' },
                  { key: 'startEndDepot', label: 'Every route starts & ends at Central Depot' },
                ].map(c => {
                  const isChecked = localConfig.constraints[c.key as keyof VRPProblemConfig['constraints']];
                  return (
                    <div
                      key={c.key}
                      onClick={() => handleConstraint(c.key as keyof VRPProblemConfig['constraints'])}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                      }`}>
                        ✓
                      </div>
                      <span className={isChecked ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                        {c.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
