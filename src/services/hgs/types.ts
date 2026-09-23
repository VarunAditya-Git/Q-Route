// Type definitions for HGS-CVRP Engine according to Vidal (2022) specifications

export interface Customer {
  id: number; // 1 to N (0 is reserved for depot)
  x: number;
  y: number;
  demand: number;
  label?: string;
}

export interface Depot {
  x: number;
  y: number;
  label?: string;
}

export interface CVRPProblem {
  depot: Depot;
  customers: Customer[];
  vehicleCount: number; // K
  vehicleCapacity: number; // Q
}

export interface Route {
  vehicleId: number;
  customerIds: number[]; // Ordered customer visits excluding depot
  load: number;
  distance: number;
  feasible: boolean;
}

export interface ValidationDetails {
  missingCustomers: number[];
  duplicateCustomers: number[];
  capacityViolations: { routeIndex: number; load: number; capacity: number }[];
  fleetViolation: boolean;
  excessVehicles: number;
}

export interface ValidationResult {
  feasible: boolean;
  violations: ValidationDetails;
  totalViolationScore: number;
}

export interface CVRPSolution {
  id: string;
  routes: Route[];
  totalDistance: number;
  feasible: boolean;
  vehiclesUsed: number;
  validation: ValidationResult;
  penalizedCost: number;
  diversityContribution?: number;
  biasedFitness?: number;
  giantTour?: number[];
}

export interface GenerationRecord {
  generation: number;
  bestDistance: number;
  averageDistance: number;
  feasibleSolutions: number;
  populationDiversity: number;
}

export interface HGSConfig {
  seed: number;
  populationSize: number;
  maxGenerations: number;
  timeLimitMs: number;
  stagnationLimit: number;
  mutationRate: number;
  crossoverRate: number;
  tournamentSize: number;
  localSearchEnabled: boolean;
  twoOptEnabled: boolean;
  relocateEnabled: boolean;
  swapEnabled: boolean;
  nbElite: number;
  penaltyCapacity: number;
  penaltyFleet: number;
}

export interface HGSResult {
  problem: CVRPProblem;
  config: HGSConfig;
  baselineSolution: CVRPSolution;
  bestSolution: CVRPSolution;
  bestGeneration: number;
  totalGenerations: number;
  executionTimeMs: number;
  convergenceHistory: GenerationRecord[];
  populationSummary: {
    id: string;
    distance: number;
    feasible: boolean;
    vehiclesUsed: number;
    isBest: boolean;
  }[];
}

export interface EconomicConfig {
  costPerKm: number; // e.g. $1.75 / km
  fixedVehicleCost: number; // e.g. $150 / vehicle
  driverCostPerRoute: number; // e.g. $85 / route
  averageRevenuePerDelivery: number; // e.g. $25 / delivery
}

export interface EconomicMetrics {
  baselineDistance: number;
  optimizedDistance: number;
  savedDistance: number;
  distanceReductionPercent: number;
  fuelTransportSavings: number;
  vehicleCostSavings: number;
  driverCostSavings: number;
  totalOperationalSavings: number;
  potentialRevenueOpportunity: number;
}
