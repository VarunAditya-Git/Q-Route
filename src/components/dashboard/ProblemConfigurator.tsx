import React, { useState } from 'react';
import { Sliders, RefreshCw, Dna, Shuffle } from 'lucide-react';
import type { VRPProblemConfig, DistributionType } from '../../types/vrp';
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

  const handleHGSParam = (
    field: keyof NonNullable<VRPProblemConfig['hgsParams']>,
    val: number | boolean
  ) => {
    const prevParams = localConfig.hgsParams || {
      populationSize: 50,
      maxGenerations: 100,
      mutationRate: 0.25,
      crossoverRate: 0.9,
      localSearchEnabled: true,
      twoOptEnabled: true,
      relocateEnabled: true,
      swapEnabled: true,
    };
    const updated = {
      ...localConfig,
      hgsParams: {
        ...prevParams,
        [field]: val,
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

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(1000 + Math.random() * 90000);
    const updated = { ...localConfig, seed: newSeed };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleApplySection33Preset = () => {
    const updated: VRPProblemConfig = {
      ...localConfig,
      seed: 42,
      customerCount: 10,
      vehicleCount: 3,
      vehicleCapacity: 40,
      distribution: 'clustered',
      hgsParams: {
        populationSize: 50,
        maxGenerations: 100,
        mutationRate: 0.25,
        crossoverRate: 0.9,
        localSearchEnabled: true,
        twoOptEnabled: true,
        relocateEnabled: true,
        swapEnabled: true,
      },
    };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const hgsParams = localConfig.hgsParams || {
    populationSize: 50,
    maxGenerations: 100,
    mutationRate: 0.25,
    crossoverRate: 0.9,
    localSearchEnabled: true,
    twoOptEnabled: true,
    relocateEnabled: true,
    swapEnabled: true,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" className="mb-1">PROBLEM CONFIGURATOR</Badge>
          <h1 className="text-2xl font-extrabold text-white">VRP Problem Setup</h1>
          <p className="text-slate-400 text-sm">
            Configure customer spatial distributions, vehicle constraints, and seeded PRNG.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApplySection33Preset}
            className="px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
            title="Load the 10-customer deterministic verification benchmark"
          >
            Load Section 33 Benchmark (N=10, Seed=42)
          </button>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Problem</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Problem Parameters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Problem Parameters</span>
          </h2>

          {/* Seed Input */}
          <div className="space-y-2 font-mono bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                Deterministic PRNG Seed
              </span>
              <button
                onClick={handleRandomizeSeed}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Randomize
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={localConfig.seed ?? 42}
                onChange={e => handleSlider('seed', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                Default: 42 (Reproducible)
              </span>
            </div>
          </div>

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
              <span className="text-slate-400">Available Fleet Vehicles ($K$)</span>
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
            <span className="text-xs text-slate-400 block">Spatial Node Distribution</span>
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

        {/* Right Column: HGS Metaheuristic Hyperparameters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Dna className="w-4 h-4 text-purple-400" />
            <span>Hybrid Genetic Search (HGS) Parameters</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Population ($\mu$)</span>
                <span className="text-purple-300 font-bold">{hgsParams.populationSize}</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={hgsParams.populationSize}
                onChange={e => handleHGSParam('populationSize', parseInt(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Max Generations</span>
                <span className="text-purple-300 font-bold">{hgsParams.maxGenerations}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="20"
                value={hgsParams.maxGenerations}
                onChange={e => handleHGSParam('maxGenerations', parseInt(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2 font-mono">
            <span className="text-xs text-slate-400 block">Local Search Neighborhoods (VND)</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'twoOptEnabled', label: '2-Opt', desc: 'Edge reversal' },
                { key: 'relocateEnabled', label: 'Relocate', desc: '1-0 transfer' },
                { key: 'swapEnabled', label: 'Swap', desc: '1-1 exchange' },
              ].map(ls => {
                const isEnabled = hgsParams[ls.key as keyof typeof hgsParams] as boolean;
                return (
                  <button
                    key={ls.key}
                    type="button"
                    onClick={() => handleHGSParam(ls.key as keyof typeof hgsParams, !isEnabled)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer text-left transition-all ${
                      isEnabled
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{ls.label}</span>
                      <span className="text-[10px]">{isEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{ls.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 font-mono pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 block">Hard Mathematical Constraints</span>
            <div className="space-y-2 text-xs">
              {[
                { key: 'visitOnce', label: 'Every customer visited exactly once' },
                { key: 'capacityCheck', label: 'Route total load ≤ Vehicle capacity ($Q$)' },
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
      </div>
    </div>
  );
};
