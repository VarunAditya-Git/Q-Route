import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Network, Workflow, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

type DiagramType = 'system' | 'pipeline' | 'loop' | 'modules';

interface NodeDetail {
  id: string;
  title: string;
  layer: string;
  color: string;
  description: string;
  inputs: string;
  outputs: string;
  tech: string;
}

const NODE_DETAILS: Record<string, NodeDetail> = {
  ProblemConfigurator: {
    id: 'ProblemConfigurator',
    title: 'ProblemConfigurator.tsx',
    layer: 'Frontend Presentation',
    color: '#3b82f6',
    description: 'React component handling user hyperparameter inputs (pLayers, shots, penalty coefficients, selected optimizer).',
    inputs: 'User UI interactions & form selections',
    outputs: 'VRPProblemConfig & QAOASettings object',
    tech: 'React 19, Tailwind CSS v4, Lucide Icons',
  },
  QuantumVisualizer: {
    id: 'QuantumVisualizer',
    title: 'QuantumVisualizer.tsx',
    layer: 'Frontend Presentation',
    color: '#3b82f6',
    description: 'Renders QAOA ansatz circuit schematics, statevector probability bar charts, and energy expectation convergence curves.',
    inputs: 'QuantumExecutionData & QAOARoutingResult',
    outputs: 'Interactive charts & quantum telemetry display',
    tech: 'Recharts, Canvas API, Framer Motion',
  },
  RouteMap: {
    id: 'RouteMap',
    title: 'RouteMap.tsx',
    layer: 'Frontend Presentation',
    color: '#3b82f6',
    description: '2D spatial grid renderer drawing depot, customer locations, assigned vehicles, and optimized delivery tours.',
    inputs: 'DepotNode, CustomerNode[], Vehicle[]',
    outputs: 'Scaled SVG/Canvas route visualization',
    tech: 'HTML5 Canvas API, SVG Overlay',
  },
  QRouteAPI: {
    id: 'QRouteAPI',
    title: 'src/services/api.ts',
    layer: 'API Orchestration Layer',
    color: '#ea580c',
    description: 'Central API service dispatching optimization tasks asynchronously to classical HGS or quantum QAOA solvers.',
    inputs: 'problemId, QAOASettings, VRPProblemConfig',
    outputs: 'Promise<OptimizationResult>',
    tech: 'TypeScript Async/Await, Service Pattern',
  },
  quboBuilder: {
    id: 'quboBuilder',
    title: 'quboBuilder.ts',
    layer: 'QAOA Engine Core',
    color: '#10b981',
    description: 'Formulates the Capacitated Vehicle Routing Problem into a symmetric Quadratic Unconstrained Binary Optimization (QUBO) matrix Q.',
    inputs: 'Depot, Customer coordinates, Penalty A & B',
    outputs: 'Upper triangular N*N QUBO matrix Q',
    tech: 'Matrix Linear Algebra, Quadratic Forms',
  },
  hamiltonianBuilder: {
    id: 'hamiltonianBuilder',
    title: 'hamiltonianBuilder.ts',
    layer: 'QAOA Engine Core',
    color: '#10b981',
    description: 'Converts binary decision variables x_i into Ising spin operators Z_i via linear transformation x_i = (1 - Z_i) / 2.',
    inputs: 'QUBO matrix Q',
    outputs: 'Linear h_i and quadratic J_ij interaction tensors',
    tech: 'Pauli-Z Spin Transformation, Ising Model',
  },
  circuitBuilder: {
    id: 'circuitBuilder',
    title: 'circuitBuilder.ts',
    layer: 'QAOA Engine Core',
    color: '#8b5cf6',
    description: 'Generates p-layer parameterized quantum ansatz circuit consisting of Hadamard initialization, RZ cost phase gates, CNOT entanglers, and RX mixers.',
    inputs: 'h_i, J_ij, gamma & beta trial angles',
    outputs: 'QuantumCircuitGate[] sequence schema',
    tech: 'Quantum Circuit Gate Synthesizer',
  },
  optimizer: {
    id: 'optimizer',
    title: 'optimizer.ts',
    layer: 'QAOA Engine Core',
    color: '#10b981',
    description: 'Executes classical variational optimization loop (SPSA / COBYLA) tuning angles (gamma, beta) to minimize cost expectation <H_C>.',
    inputs: 'Trial angles (gamma, beta), backend evaluator',
    outputs: 'Optimal variational angles & min expectation energy',
    tech: 'SPSA (Stochastic Perturbation), COBYLA',
  },
  backendAdapter: {
    id: 'backendAdapter',
    title: 'backendAdapter.ts',
    layer: 'Execution Backends',
    color: '#8b5cf6',
    description: 'Abstract execution interface delegating to statevector simulator, shot-based Aer simulator, or physical IBM Quantum hardware.',
    inputs: 'Quantum circuit ansatz & measurement shots',
    outputs: 'Probability distribution vector & measurement counts',
    tech: 'Statevector Math, Aer Simulator, Qiskit / IBM API',
  },
  feasibilityRepair: {
    id: 'feasibilityRepair',
    title: 'feasibility.ts & decoder.ts',
    layer: 'Post-Processing',
    color: '#f59e0b',
    description: 'Decodes measured bitstrings into customer sequences, detects position collisions or missing cities, and applies a deterministic repair heuristic.',
    inputs: 'Measured bitstrings & customer list',
    outputs: 'Guaranteed valid customer visit order & feasibility flag',
    tech: 'Greedy Repair Heuristic, Collision Resolver',
  },
  routeReconstruction: {
    id: 'routeReconstruction',
    title: 'routeReconstruction.ts',
    layer: 'Post-Processing',
    color: '#f59e0b',
    description: 'Partitions ordered customer visits into vehicle sub-tours adhering to fleet capacity constraints Q.',
    inputs: 'Customer sequence & vehicle capacity Q',
    outputs: 'Vehicle[] array with exact tour distances',
    tech: 'Capacity Partitioning Algorithm',
  },
};

export const ArchitectureView: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>('system');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(NODE_DETAILS['quboBuilder']);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan">SYSTEM ARCHITECTURE</Badge>
            <Badge variant="purple" className="font-mono">Interactive Flowcharts</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Q-Route System Architecture & Pipeline Flowcharts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Interactive, zoomable architectural diagrams featuring color-coded component layers and complete pipeline documentation.
          </p>
        </div>

        {/* Diagram Switcher Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'system', label: 'System Integration', icon: <Network className="w-3.5 h-3.5" /> },
            { id: 'pipeline', label: '12-Stage Pipeline', icon: <Workflow className="w-3.5 h-3.5" /> },
            { id: 'loop', label: 'Optimization Loop', icon: <RotateCcw className="w-3.5 h-3.5" /> },
            { id: 'modules', label: 'Code Modules', icon: <Layers className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDiagram(tab.id as DiagramType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeDiagram === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Canvas & Diagram Container (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-slate-200">
                {activeDiagram === 'system' && 'Full System Layer Integration'}
                {activeDiagram === 'pipeline' && '12-Stage QAOA Execution Pipeline'}
                {activeDiagram === 'loop' && 'Classical-Quantum Variational Loop'}
                {activeDiagram === 'modules' && 'Modular TypeScript Architecture'}
              </span>
            </div>

            {/* Zoom Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Flowchart SVG Screen */}
          <div className="relative overflow-auto max-h-[550px] min-h-[440px] bg-[#030712] rounded-xl border border-slate-900 p-6 flex items-center justify-center cursor-grab active:cursor-grabbing">
            
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.25s ease-out',
              }}
              className="w-full flex justify-center"
            >
              {/* DIAGRAM 1: SYSTEM ARCHITECTURE */}
              {activeDiagram === 'system' && (
                <svg width="780" height="420" viewBox="0 0 780 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
                    <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#ea580c"/></linearGradient>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#064e3b"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
                    <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
                    <linearGradient id="gradAmber" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#78350f"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
                  </defs>

                  {/* LAYER 1: FRONTEND */}
                  <rect x="10" y="10" width="760" height="95" rx="12" fill="url(#gradBlue)" stroke="#60a5fa" strokeWidth="2" opacity="0.9" />
                  <text x="25" y="32" fill="#93c5fd" fontFamily="monospace" fontWeight="bold" fontSize="11" letterSpacing="1">1. FRONTEND PRESENTATION LAYER (React 19 + Tailwind v4)</text>
                  
                  <g onClick={() => setSelectedNode(NODE_DETAILS['ProblemConfigurator'])} className="cursor-pointer hover:opacity-80">
                    <rect x="30" y="45" width="220" height="45" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="140" y="72" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">ProblemConfigurator</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['QuantumVisualizer'])} className="cursor-pointer hover:opacity-80">
                    <rect x="280" y="45" width="220" height="45" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="390" y="72" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">QuantumVisualizer</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['RouteMap'])} className="cursor-pointer hover:opacity-80">
                    <rect x="530" y="45" width="220" height="45" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="640" y="72" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">RouteMap Visualizer</text>
                  </g>

                  {/* Connectors L1 -> L2 */}
                  <path d="M 140 90 L 140 130" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
                  <path d="M 390 130 L 390 90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
                  <path d="M 640 130 L 640 90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />

                  {/* LAYER 2: API LAYER */}
                  <g onClick={() => setSelectedNode(NODE_DETAILS['QRouteAPI'])} className="cursor-pointer hover:opacity-80">
                    <rect x="10" y="135" width="760" height="65" rx="12" fill="url(#gradOrange)" stroke="#fb923c" strokeWidth="2" opacity="0.9" />
                    <text x="25" y="155" fill="#fed7aa" fontFamily="monospace" fontWeight="bold" fontSize="11" letterSpacing="1">2. API DISPATCH LAYER (src/services/api.ts)</text>
                    <rect x="150" y="162" width="480" height="30" rx="6" fill="#1c1917" stroke="#f97316" strokeWidth="1.5" />
                    <text x="390" y="182" fill="#fdba74" fontFamily="monospace" fontSize="12" fontWeight="bold" textAnchor="middle">QRouteAPI.optimizeQAOA(problemId, settings, vrpConfig)</text>
                  </g>

                  <path d="M 390 200 L 390 235" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />

                  {/* LAYER 3: QAOA ENGINE */}
                  <rect x="10" y="240" width="760" height="90" rx="12" fill="url(#gradGreen)" stroke="#34d399" strokeWidth="2" opacity="0.9" />
                  <text x="25" y="260" fill="#a7f3d0" fontFamily="monospace" fontWeight="bold" fontSize="11" letterSpacing="1">3. QAOA SOLVER ENGINE (src/services/qaoa/*)</text>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['quboBuilder'])} className="cursor-pointer hover:opacity-80">
                    <rect x="25" y="275" width="130" height="42" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="90" y="301" fill="#ecfdf5" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">quboBuilder</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['hamiltonianBuilder'])} className="cursor-pointer hover:opacity-80">
                    <rect x="175" y="275" width="150" height="42" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="250" y="301" fill="#ecfdf5" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">hamiltonianBuilder</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['circuitBuilder'])} className="cursor-pointer hover:opacity-80">
                    <rect x="345" y="275" width="135" height="42" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="412" y="301" fill="#ecfdf5" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">circuitBuilder</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['optimizer'])} className="cursor-pointer hover:opacity-80">
                    <rect x="500" y="275" width="125" height="42" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="562" y="301" fill="#ecfdf5" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">optimizer</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['feasibilityRepair'])} className="cursor-pointer hover:opacity-80">
                    <rect x="645" y="275" width="115" height="42" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="702" y="301" fill="#ecfdf5" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">feasibility</text>
                  </g>

                  {/* Connectors L3 -> L4/L5 */}
                  <path d="M 412 330 L 200 355" stroke="#c084fc" strokeWidth="2" />
                  <path d="M 562 330 L 580 355" stroke="#fbbf24" strokeWidth="2" />

                  {/* LAYER 4: BACKENDS & RECONSTRUCTION */}
                  <g onClick={() => setSelectedNode(NODE_DETAILS['backendAdapter'])} className="cursor-pointer hover:opacity-80">
                    <rect x="10" y="355" width="370" height="50" rx="8" fill="url(#gradPurple)" stroke="#c084fc" strokeWidth="2" />
                    <text x="195" y="385" fill="#f3e8ff" fontFamily="monospace" fontWeight="bold" fontSize="12" textAnchor="middle">4. backendAdapter (Statevector / Aer / IBM Q)</text>
                  </g>

                  <g onClick={() => setSelectedNode(NODE_DETAILS['routeReconstruction'])} className="cursor-pointer hover:opacity-80">
                    <rect x="400" y="355" width="370" height="50" rx="8" fill="url(#gradAmber)" stroke="#fbbf24" strokeWidth="2" />
                    <text x="585" y="385" fill="#fffbeb" fontFamily="monospace" fontWeight="bold" fontSize="12" textAnchor="middle">5. routeReconstruction (Capacity Partition)</text>
                  </g>
                </svg>
              )}

              {/* DIAGRAM 2: 12-STAGE PIPELINE */}
              {activeDiagram === 'pipeline' && (
                <svg width="780" height="460" viewBox="0 0 780 460" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* PHASE 1: BLUE */}
                  <rect x="10" y="10" width="760" height="90" rx="10" fill="#0369a1" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="25" y="30" fill="#e0f2fe" fontFamily="monospace" fontWeight="bold" fontSize="11">PHASE 1: INPUT VALIDATION & QUBO MATRIX FORMULATION</text>
                  
                  <rect x="25" y="42" width="220" height="45" rx="6" fill="#0f172a" stroke="#0284c7" />
                  <text x="135" y="68" fill="#7dd3fc" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">1. Problem Validator</text>

                  <rect x="270" y="42" width="230" height="45" rx="6" fill="#0f172a" stroke="#0284c7" />
                  <text x="385" y="68" fill="#7dd3fc" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">2. Spatial Distance Matrix</text>

                  <rect x="525" y="42" width="230" height="45" rx="6" fill="#0f172a" stroke="#0284c7" />
                  <text x="640" y="68" fill="#7dd3fc" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">3. QUBO Matrix Builder</text>

                  {/* PHASE 2: PURPLE */}
                  <rect x="10" y="120" width="760" height="90" rx="10" fill="#6b21a8" fillOpacity="0.8" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="25" y="140" fill="#f3e8ff" fontFamily="monospace" fontWeight="bold" fontSize="11">PHASE 2: ISING HAMILTONIAN & QAOA CIRCUIT ANSATZ</text>

                  <rect x="25" y="152" width="220" height="45" rx="6" fill="#0f172a" stroke="#a855f7" />
                  <text x="135" y="178" fill="#e9d5ff" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">4. Ising Spin Hamiltonian</text>

                  <rect x="270" y="152" width="230" height="45" rx="6" fill="#0f172a" stroke="#a855f7" />
                  <text x="385" y="178" fill="#e9d5ff" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">5. QAOA Circuit Generator</text>

                  <rect x="525" y="152" width="230" height="45" rx="6" fill="#0f172a" stroke="#a855f7" />
                  <text x="640" y="178" fill="#e9d5ff" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">6. Parameter Optimizer</text>

                  {/* PHASE 3: TEAL */}
                  <rect x="10" y="230" width="760" height="90" rx="10" fill="#0f766e" fillOpacity="0.8" stroke="#2dd4bf" strokeWidth="1.5" />
                  <text x="25" y="250" fill="#ccfbf1" fontFamily="monospace" fontWeight="bold" fontSize="11">PHASE 3: BACKEND EXECUTION & MEASUREMENT SAMPLING</text>

                  <rect x="25" y="262" width="220" height="45" rx="6" fill="#0f172a" stroke="#14b8a6" />
                  <text x="135" y="288" fill="#99f6e4" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">7. Backend Adapter</text>

                  <rect x="270" y="262" width="230" height="45" rx="6" fill="#0f172a" stroke="#14b8a6" />
                  <text x="385" y="288" fill="#99f6e4" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">8. Measurement Sampling</text>

                  <rect x="525" y="262" width="230" height="45" rx="6" fill="#0f172a" stroke="#14b8a6" />
                  <text x="640" y="288" fill="#99f6e4" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">9. Bitstring Decoder</text>

                  {/* PHASE 4: GREEN */}
                  <rect x="10" y="340" width="760" height="90" rx="10" fill="#15803d" fillOpacity="0.8" stroke="#34d399" strokeWidth="1.5" />
                  <text x="25" y="360" fill="#dcfce7" fontFamily="monospace" fontWeight="bold" fontSize="11">PHASE 4: FEASIBILITY REPAIR & PORTAL VISUALIZATION</text>

                  <rect x="25" y="372" width="220" height="45" rx="6" fill="#0f172a" stroke="#22c55e" />
                  <text x="135" y="398" fill="#86efac" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">10. Feasibility & Repair</text>

                  <rect x="270" y="372" width="230" height="45" rx="6" fill="#0f172a" stroke="#22c55e" />
                  <text x="385" y="398" fill="#86efac" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">11. Route Reconstruction</text>

                  <rect x="525" y="372" width="230" height="45" rx="6" fill="#0f172a" stroke="#22c55e" />
                  <text x="640" y="398" fill="#86efac" fontFamily="monospace" fontSize="11" fontWeight="bold" text-anchor="middle">12. Portal Visualizer</text>
                </svg>
              )}

              {/* DIAGRAM 3: VARIATIONAL OPTIMIZATION LOOP */}
              {activeDiagram === 'loop' && (
                <svg width="740" height="360" viewBox="0 0 740 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="40" width="200" height="60" rx="10" fill="#c2410c" stroke="#fb923c" strokeWidth="2" />
                  <text x="140" y="75" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">Trial Angles (γ, β)</text>

                  <path d="M 240 70 L 300 70" stroke="#fb923c" strokeWidth="2" strokeDasharray="4" />

                  <rect x="300" y="40" width="210" height="60" rx="10" fill="#6b21a8" stroke="#c084fc" strokeWidth="2" />
                  <text x="405" y="75" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">Build QAOA Ansatz</text>

                  <path d="M 405 100 L 405 160" stroke="#c084fc" strokeWidth="2" />

                  <rect x="300" y="160" width="210" height="60" rx="10" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" />
                  <text x="405" y="195" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">Execute Quantum Backend</text>

                  <path d="M 405 220 L 405 270" stroke="#2dd4bf" strokeWidth="2" />

                  <rect x="300" y="270" width="210" height="60" rx="10" fill="#15803d" stroke="#34d399" strokeWidth="2" />
                  <text x="405" y="305" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">Compute Expected Energy</text>

                  <path d="M 300 300 L 140 300 L 140 100" stroke="#34d399" strokeWidth="2" />

                  <rect x="40" y="160" width="200" height="60" rx="10" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                  <text x="140" y="195" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">SPSA / COBYLA Optimizer</text>
                </svg>
              )}

              {/* DIAGRAM 4: CODE MODULES */}
              {activeDiagram === 'modules' && (
                <svg width="740" height="380" viewBox="0 0 740 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="240" y="20" width="260" height="50" rx="10" fill="#c2410c" stroke="#fb923c" strokeWidth="2" />
                  <text x="370" y="50" fill="#ffffff" fontFamily="monospace" fontSize="13" fontWeight="bold" text-anchor="middle">src/services/qaoa/qaoaService.ts</text>

                  <rect x="40" y="110" width="200" height="45" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="140" y="137" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">validator.ts</text>

                  <rect x="270" y="110" width="200" height="45" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                  <text x="370" y="137" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">quboBuilder.ts</text>

                  <rect x="500" y="110" width="200" height="45" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                  <text x="600" y="137" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">hamiltonianBuilder.ts</text>

                  <rect x="40" y="190" width="200" height="45" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="140" y="217" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">circuitBuilder.ts</text>

                  <rect x="270" y="190" width="200" height="45" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="370" y="217" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">optimizer.ts</text>

                  <rect x="500" y="190" width="200" height="45" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="600" y="217" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">backendAdapter.ts</text>

                  <rect x="40" y="270" width="200" height="45" rx="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="140" y="297" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">decoder.ts</text>

                  <rect x="270" y="270" width="200" height="45" rx="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="370" y="297" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">feasibility.ts</text>

                  <rect x="500" y="270" width="200" height="45" rx="8" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="600" y="297" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold" text-anchor="middle">routeReconstruction.ts</text>
                </svg>
              )}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-center">
            💡 Click on any component box above to inspect its implementation specifications, inputs, outputs, and layer role.
          </div>
        </div>

        {/* Selected Component Inspection Panel (1 Column) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-white font-mono">
              COMPONENT SPECIFICATION
            </h2>
          </div>

          {selectedNode ? (
            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Module Name</span>
                <span className="text-white text-sm font-extrabold flex items-center gap-2" style={{ color: selectedNode.color }}>
                  <ChevronRight className="w-4 h-4" /> {selectedNode.title}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Architectural Layer</span>
                <div className="text-slate-200 font-bold">{selectedNode.layer}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Description</span>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">
                  {selectedNode.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">Data Inputs</span>
                <div className="text-slate-300">{selectedNode.inputs}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Data Outputs</span>
                <div className="text-slate-300">{selectedNode.outputs}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-purple-400 uppercase font-bold">Tech Stack & Algorithms</span>
                <div className="text-slate-300">{selectedNode.tech}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              Select a component node in the flowchart to view detailed specifications.
            </div>
          )}

          {/* Quick Stats Summary */}
          <div className="pt-4 border-t border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>QAOA Max Qubits:</span>
              <span className="text-cyan-400 font-bold">25 Qubits (Statevector)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Default Shots:</span>
              <span className="text-purple-400 font-bold">1,024 Measurements</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Constraint Penalties:</span>
              <span className="text-emerald-400 font-bold">P_A = 500, P_B = 500</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
