import { useState, useEffect } from 'react';
import type { ActiveTab, OptimizationResult, VRPProblemConfig } from './types/vrp';
import { QRouteAPI, DEFAULT_CONFIG } from './services/api';

// Landing Page Components
import { LandingHero } from './components/landing/LandingHero';
import { VRPExplanationSection } from './components/landing/VRPExplanationSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { ProductPositioningBanner } from './components/landing/ProductPositioningBanner';
import { LandingCTA } from './components/landing/LandingCTA';

// Dashboard Components
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';
import { OverviewView } from './components/dashboard/OverviewView';
import { ProblemConfigurator } from './components/dashboard/ProblemConfigurator';
import { RouteMap } from './components/map/RouteMap';
import { HGSVisualizer } from './components/dashboard/HGSVisualizer';
import { QuantumVisualizer } from './components/dashboard/QuantumVisualizer';
import { ComparisonView } from './components/dashboard/ComparisonView';
import { ResultsView } from './components/dashboard/ResultsView';
import { ResearchModeView } from './components/dashboard/ResearchModeView';
import { OptimizationProgressModal } from './components/dashboard/OptimizationProgressModal';

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [config, setConfig] = useState<VRPProblemConfig>(DEFAULT_CONFIG);
  const [optimizationData, setOptimizationData] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const data = await QRouteAPI.generateProblem(config);
      setOptimizationData(data);
      setIsLoading(false);
    }
    init();
  }, []);

  const handleGenerateProblem = async () => {
    setIsLoading(true);
    const newData = await QRouteAPI.generateProblem(config);
    setOptimizationData(newData);
    setIsLoading(false);
  };

  const handleLaunchDashboard = () => {
    setViewMode('dashboard');
    setActiveTab('overview');
  };

  const handleRunOptimization = async () => {
    if (!optimizationData) return;
    setIsOptimizing(true);
    setIsModalOpen(true);
    try {
      const updated = await QRouteAPI.optimizeHGS(optimizationData.id);
      setOptimizationData(updated);
    } catch (e) {
      console.error('Optimization error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveTab('results');
  };

  if (isLoading || !optimizationData) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-cyan-400">Initializing Q-Route VRP Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {viewMode === 'landing' && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-extrabold font-mono text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              Q
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white font-mono text-lg leading-tight">Q-Route</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Quantum-Enhanced Vehicle Routing Optimization</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLaunchDashboard}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              LAUNCH OPTIMIZER
            </button>
          </div>
        </nav>
      )}

      {viewMode === 'landing' && (
        <main className="w-full">
          <LandingHero onLaunch={handleLaunchDashboard} />
          <VRPExplanationSection />
          <HowItWorksSection />
          <ProductPositioningBanner />
          <LandingCTA onLaunch={handleLaunchDashboard} />

          <footer className="py-8 border-t border-slate-900 bg-slate-950 text-center text-xs font-mono text-slate-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>© 2026 Q-Route Quantum Optimization Platform Prototype</span>
              <span>University Quantum Computing Hackathon Prototype</span>
            </div>
          </footer>
        </main>
      )}

      {viewMode === 'dashboard' && (
        <div className="flex flex-col min-h-screen">
          <Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onRunOptimization={handleRunOptimization}
            onReturnHome={() => setViewMode('landing')}
            isOptimizing={isOptimizing}
          />

          <div className="flex flex-1 relative">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
              {activeTab === 'overview' && (
                <OverviewView
                  data={optimizationData}
                  onTabChange={setActiveTab}
                  onRunOptimization={handleRunOptimization}
                  isOptimizing={isOptimizing}
                />
              )}

              {activeTab === 'setup' && (
                <ProblemConfigurator
                  config={config}
                  onUpdateConfig={setConfig}
                  onGenerate={handleGenerateProblem}
                  isGenerating={isLoading}
                />
              )}

              {activeTab === 'map' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold text-white">Full Screen Interactive Route Map</h1>
                      <p className="text-xs text-slate-400 font-mono">Coordinate Spatial Plane Matrix (1000 × 1000)</p>
                    </div>
                  </div>
                  <RouteMap
                    depot={optimizationData.depot}
                    customers={optimizationData.customers}
                    vehicles={optimizationData.vehicles}
                    isOptimizing={isOptimizing}
                    height="h-[720px]"
                  />
                </div>
              )}

              {activeTab === 'hgs' && (
                <HGSVisualizer
                  data={optimizationData.hgsData}
                />
              )}

              {activeTab === 'quantum' && (
                <QuantumVisualizer
                  data={optimizationData.quantumData}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonView
                  data={optimizationData}
                />
              )}

              {activeTab === 'results' && (
                <ResultsView
                  data={optimizationData}
                />
              )}

              {activeTab === 'research' && (
                <ResearchModeView />
              )}
            </main>
          </div>
        </div>
      )}

      <OptimizationProgressModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        result={optimizationData}
      />
    </div>
  );
}

export default App;
