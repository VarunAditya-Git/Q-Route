import type { CustomerNode, DepotNode, Vehicle } from '../../types/vrp';
import { VEHICLE_COLORS, getDistance } from '../vrpSolver';

export interface RouteReconstructionResult {
  vehicles: Vehicle[];
  updatedCustomers: CustomerNode[];
  totalDistance: number;
}

export function reconstructVehicles(
  routeCustomerIds: string[],
  depot: DepotNode,
  customers: CustomerNode[],
  vehicleCount: number,
  vehicleCapacity: number
): RouteReconstructionResult {
  const updatedCustomers = customers.map(c => ({ ...c }));
  const customerMap = new Map(updatedCustomers.map(c => [c.id, c]));

  // Partition ordered route into vehicles respecting capacity constraints
  const vehicles: Vehicle[] = [];
  let overallDistance = 0;
  let currentCustomerIdx = 0;

  for (let v = 0; v < vehicleCount; v++) {
    const vehicleColor = VEHICLE_COLORS[v % VEHICLE_COLORS.length];
    const routeNodeIds: string[] = [];
    let currentLoad = 0;
    let routeDistance = 0;
    let currentPos = { x: depot.x, y: depot.y };
    let visitOrder = 1;

    while (currentCustomerIdx < routeCustomerIds.length) {
      const custId = routeCustomerIds[currentCustomerIdx];
      const cust = customerMap.get(custId);

      if (!cust) {
        currentCustomerIdx++;
        continue;
      }

      // Check capacity
      if (currentLoad + cust.demand <= vehicleCapacity || routeNodeIds.length === 0) {
        routeNodeIds.push(cust.id);
        currentLoad += cust.demand;

        const legDist = getDistance(currentPos, cust);
        routeDistance += legDist;
        currentPos = { x: cust.x, y: cust.y };

        cust.assignedVehicleId = `V${v + 1}`;
        cust.visitOrder = visitOrder++;

        currentCustomerIdx++;
      } else {
        // Vehicle capacity reached, break to assign next vehicle
        break;
      }
    }

    if (routeNodeIds.length > 0) {
      // Return to depot
      routeDistance += getDistance(currentPos, depot);
    }

    const roundedVehicleDist = Math.round(routeDistance);
    overallDistance += roundedVehicleDist;

    vehicles.push({
      id: `V${v + 1}`,
      name: `Vehicle 0${v + 1}`,
      capacity: vehicleCapacity,
      currentLoad,
      color: vehicleColor,
      routeNodeIds,
      totalDistance: roundedVehicleDist,
    });
  }

  return {
    vehicles,
    updatedCustomers,
    totalDistance: Math.round(overallDistance),
  };
}
