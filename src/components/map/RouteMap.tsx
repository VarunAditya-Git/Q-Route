import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DepotNode, CustomerNode, Vehicle } from '../../types/vrp';
import { Eye, EyeOff, MapPin, X, Grid, Sparkles, RotateCcw } from 'lucide-react';

interface RouteMapProps {
  depot: DepotNode;
  customers: CustomerNode[];
  vehicles: Vehicle[];
  isOptimizing?: boolean;
  onCustomerSelect?: (customer: CustomerNode) => void;
  selectedCustomerId?: string;
  selectedVehicleId?: string;
  onVehicleSelect?: (vehicleId: string | null) => void;
  height?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  depot,
  customers,
  vehicles,
  isOptimizing = false,
  onCustomerSelect,
  selectedCustomerId,
  selectedVehicleId,
  onVehicleSelect,
  height = 'h-[540px]',
}) => {
  const [visibleVehicles, setVisibleVehicles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    vehicles.forEach(v => { initial[v.id] = true; });
    return initial;
  });

  const [activeCustomer, setActiveCustomer] = useState<CustomerNode | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setVisibleVehicles(prev => {
      const next = { ...prev };
      vehicles.forEach(v => {
        if (next[v.id] === undefined) next[v.id] = true;
      });
      return next;
    });
  }, [vehicles]);

  const toggleVehicleVisibility = (vId: string) => {
    setVisibleVehicles(prev => ({
      ...prev,
      [vId]: !prev[vId],
    }));
  };

  const handleNodeClick = (cust: CustomerNode) => {
    setActiveCustomer(cust);
    if (onCustomerSelect) onCustomerSelect(cust);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000);
    setHoverCoords({ x: Math.max(0, Math.min(1000, x)), y: Math.max(0, Math.min(1000, y)) });
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  return (
    <div className={`relative ${height} w-full rounded-3xl glass-panel overflow-hidden flex flex-col border border-cyan-500/30 shadow-2xl`}>
      {/* Top Header Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono pointer-events-auto">
          <div className={`w-2 h-2 rounded-full ${isOptimizing ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-slate-300 font-semibold">
            {isOptimizing ? 'SOLVER OPTIMIZING...' : 'COORDINATE MATRIX (1000 × 1000)'}
          </span>
          {hoverCoords && (
            <span className="text-cyan-400 border-l border-slate-700 pl-2">
              [{hoverCoords.x}, {hoverCoords.y}]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map utility buttons */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showGrid ? 'bg-cyan-950 text-cyan-300' : 'text-slate-500 hover:text-white'}`}
              title="Toggle Grid Lines"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowParticles(!showParticles)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showParticles ? 'bg-purple-950 text-purple-300' : 'text-slate-500 hover:text-white'}`}
              title="Toggle Particle Animation"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            {selectedVehicleId && (
              <button
                onClick={() => onVehicleSelect && onVehicleSelect(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Vehicle Filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Vehicle Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto max-w-[420px]">
            {vehicles.map(v => {
              const isVisible = visibleVehicles[v.id] !== false;
              const isSelected = selectedVehicleId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    toggleVehicleVisibility(v.id);
                    if (onVehicleSelect) onVehicleSelect(isSelected ? null : v.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                    isVisible 
                      ? isSelected ? 'ring-2 ring-cyan-400 bg-slate-800' : 'bg-slate-900/90 hover:bg-slate-800' 
                      : 'opacity-40 bg-slate-950 border-slate-800'
                  }`}
                  style={{ borderColor: isVisible ? `${v.color}60` : undefined }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                  <span className="text-white font-medium">{v.name}</span>
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full h-full relative bg-[#050914] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        <svg
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair select-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow-depot" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-route" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Spatial Grid & Axis Markers */}
          {showGrid && (
            <g opacity="0.25">
              {[200, 400, 600, 800].map(coord => (
                <g key={`grid-${coord}`}>
                  <line x1={coord} y1="0" x2={coord} y2="1000" stroke="#38bdf8" strokeDasharray="4 6" strokeWidth="1" />
                  <line x1="0" y1={coord} x2="1000" y2={coord} stroke="#38bdf8" strokeDasharray="4 6" strokeWidth="1" />
                  <text x={coord + 4} y="20" fill="#64748b" fontSize="11" fontFamily="monospace">{coord}</text>
                  <text x="8" y={coord - 4} fill="#64748b" fontSize="11" fontFamily="monospace">{coord}</text>
                </g>
              ))}
            </g>
          )}

          {/* Vehicle Routes */}
          {vehicles.map(vehicle => {
            if (visibleVehicles[vehicle.id] === false) return null;

            const routeNodes = vehicle.routeNodeIds
              .map(id => customers.find(c => c.id === id))
              .filter((c): c is CustomerNode => c !== undefined);

            if (routeNodes.length === 0) return null;

            const fullPoints = [depot, ...routeNodes, depot];
            const dPath = fullPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
            const isHighlighted = selectedVehicleId === vehicle.id;

            return (
              <g key={vehicle.id}>
                <path
                  d={dPath}
                  fill="none"
                  stroke={vehicle.color}
                  strokeWidth={isHighlighted ? 6 : 3}
                  strokeOpacity={selectedVehicleId && !isHighlighted ? 0.15 : 0.4}
                  strokeDasharray={isOptimizing ? "8 6" : undefined}
                  filter="url(#glow-route)"
                  className="transition-all duration-300"
                />
                
                <path
                  d={dPath}
                  fill="none"
                  stroke={vehicle.color}
                  strokeWidth={isHighlighted ? 3.5 : 2}
                  strokeOpacity={selectedVehicleId && !isHighlighted ? 0.2 : 0.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {showParticles && fullPoints.slice(0, -1).map((pt1, idx) => {
                  const pt2 = fullPoints[idx + 1];
                  return (
                    <circle
                      key={`particle-${vehicle.id}-${idx}`}
                      r={isHighlighted ? 4.5 : 3.5}
                      fill={vehicle.color}
                      className="filter drop-shadow-[0_0_6px_currentColor]"
                    >
                      <animateMotion
                        path={`M ${pt1.x} ${pt1.y} L ${pt2.x} ${pt2.y}`}
                        dur={`${2.2 + (idx % 3) * 0.8}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
              </g>
            );
          })}

          {/* Customer Nodes */}
          {customers.map(cust => {
            const assignedVehicle = vehicles.find(v => v.id === cust.assignedVehicleId);
            const isVisible = !assignedVehicle || visibleVehicles[assignedVehicle.id] !== false;
            if (!isVisible) return null;

            const isSelected = selectedCustomerId === cust.id || activeCustomer?.id === cust.id;
            const nodeColor = assignedVehicle ? assignedVehicle.color : '#94a3b8';

            return (
              <g
                key={cust.id}
                transform={`translate(${cust.x}, ${cust.y})`}
                onClick={() => handleNodeClick(cust)}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}

                <circle
                  r="15"
                  fill={nodeColor}
                  fillOpacity="0.25"
                  stroke={nodeColor}
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />

                <circle
                  r="9.5"
                  fill="#0b1329"
                  stroke={nodeColor}
                  strokeWidth="2.5"
                />

                <text
                  y="-18"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-md select-none"
                >
                  {cust.id}
                </text>

                <text
                  y="3.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="800"
                  fontFamily="sans-serif"
                  className="pointer-events-none select-none"
                >
                  {cust.demand}
                </text>
              </g>
            );
          })}

          {/* Central Depot Node */}
          <g transform={`translate(${depot.x}, ${depot.y})`} className="z-30">
            <circle
              r="48"
              fill="#06b6d4"
              fillOpacity="0.12"
              filter="url(#glow-depot)"
              className="animate-pulse-subtle"
            />
            <circle
              r="28"
              fill="#090d16"
              stroke="#06b6d4"
              strokeWidth="3.5"
            />
            <rect
              x="-12"
              y="-12"
              width="24"
              height="24"
              rx="5"
              fill="#06b6d4"
            />
            <text
              y="44"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="12"
              fontWeight="800"
              fontFamily="monospace"
              className="select-none tracking-widest"
            >
              DEPOT
            </text>
            <text
              y="58"
              textAnchor="middle"
              fill="#64748b"
              fontSize="9"
              fontFamily="monospace"
              className="select-none"
            >
              [{depot.x}, {depot.y}]
            </text>
          </g>
        </svg>
      </div>

      {/* Customer Node Details Modal / Floating Popover */}
      <AnimatePresence>
        {activeCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-4 left-4 z-30 w-80 glass-panel-glow p-4 rounded-2xl border border-cyan-500/40 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm font-mono">{activeCustomer.name}</span>
              </div>
              <button
                onClick={() => setActiveCustomer(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Customer ID</span>
                <span className="font-bold text-cyan-300">{activeCustomer.id}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Demand Units</span>
                <span className="font-bold text-emerald-400">{activeCustomer.demand} units</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Assigned Vehicle</span>
                <span className="font-bold text-purple-300">
                  {activeCustomer.assignedVehicleId || 'Unassigned'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Visit Order</span>
                <span className="font-bold text-amber-300">
                  #{activeCustomer.visitOrder || '-'}
                </span>
              </div>
            </div>

            <div className="mt-2 text-slate-400 text-[11px] flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
              <span>Dist. from Depot: <strong className="text-white">{activeCustomer.distanceFromDepot} km</strong></span>
              <span>Coords: <strong className="text-cyan-300">[{activeCustomer.x}, {activeCustomer.y}]</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
