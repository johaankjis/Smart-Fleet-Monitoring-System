// Mock database implementation
// In production, replace with actual database connection (Supabase, Neon, etc.)

import type { Vehicle, Telemetry, Alert, VehicleLatestStatus, TelemetryPayload } from "./db-schema"

// In-memory storage (simulates database)
const vehicles: Vehicle[] = [
  {
    vehicle_id: "VEH-1001",
    vehicle_type: "Truck",
    make: "Freightliner",
    model: "Cascadia",
    year: 2022,
    vin: "1FUJGHDV8NLXXXXXX",
    license_plate: "TRK-001",
    status: "active",
    last_maintenance_date: new Date("2024-12-01"),
    next_maintenance_date: new Date("2025-03-01"),
    odometer: 125430.5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicle_id: "VEH-1002",
    vehicle_type: "Van",
    make: "Ford",
    model: "Transit",
    year: 2023,
    status: "active",
    odometer: 87650.25,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicle_id: "VEH-1003",
    vehicle_type: "Sedan",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    status: "active",
    odometer: 45230.75,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicle_id: "VEH-1004",
    vehicle_type: "SUV",
    make: "Chevrolet",
    model: "Tahoe",
    year: 2022,
    status: "active",
    odometer: 98765.0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicle_id: "VEH-1005",
    vehicle_type: "Truck",
    make: "Peterbilt",
    model: "579",
    year: 2021,
    status: "maintenance",
    odometer: 156890.3,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

let telemetry: Telemetry[] = []
const alerts: Alert[] = []
let telemetryIdCounter = 1
let alertIdCounter = 1

// Database operations
export const db = {
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return vehicles
  },

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    return vehicles.find((v) => v.vehicle_id === vehicleId) || null
  },

  async createVehicle(vehicle: Omit<Vehicle, "created_at" | "updated_at">): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      created_at: new Date(),
      updated_at: new Date(),
    }
    vehicles.push(newVehicle)
    return newVehicle
  },

  // Telemetry
  async getTelemetry(vehicleId?: string, limit = 100): Promise<Telemetry[]> {
    let data = telemetry
    if (vehicleId) {
      data = data.filter((t) => t.vehicle_id === vehicleId)
    }
    return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  },

  async getLatestTelemetry(vehicleId: string): Promise<Telemetry | null> {
    const data = telemetry
      .filter((t) => t.vehicle_id === vehicleId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    return data[0] || null
  },

  async createTelemetry(data: TelemetryPayload): Promise<Telemetry> {
    const newTelemetry: Telemetry = {
      id: telemetryIdCounter++,
      vehicle_id: data.vehicle_id,
      timestamp: new Date(data.timestamp),
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      speed: data.speed,
      engine_temperature: data.engine_temperature,
      fuel_level: data.fuel_level,
      odometer: data.odometer,
      engine_status: data.engine_status as Telemetry["engine_status"],
      tire_pressure_fl: data.tire_pressure.front_left,
      tire_pressure_fr: data.tire_pressure.front_right,
      tire_pressure_rl: data.tire_pressure.rear_left,
      tire_pressure_rr: data.tire_pressure.rear_right,
      battery_voltage: data.battery_voltage,
      created_at: new Date(),
    }
    telemetry.push(newTelemetry)

    // Keep only last 1000 records per vehicle to prevent memory issues
    const vehicleTelemetry = telemetry.filter((t) => t.vehicle_id === data.vehicle_id)
    if (vehicleTelemetry.length > 1000) {
      const sorted = vehicleTelemetry.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      const toRemove = sorted.slice(1000)
      telemetry = telemetry.filter((t) => !toRemove.includes(t))
    }

    return newTelemetry
  },

  // Alerts
  async getAlerts(vehicleId?: string, acknowledged?: boolean): Promise<Alert[]> {
    let data = alerts
    if (vehicleId) {
      data = data.filter((a) => a.vehicle_id === vehicleId)
    }
    if (acknowledged !== undefined) {
      data = data.filter((a) => a.acknowledged === acknowledged)
    }
    return data.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  },

  async createAlert(alert: Omit<Alert, "id" | "acknowledged" | "resolved" | "created_at">): Promise<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: alertIdCounter++,
      acknowledged: false,
      resolved: false,
      created_at: new Date(),
    }
    alerts.push(newAlert)
    return newAlert
  },

  async acknowledgeAlert(alertId: number, acknowledgedBy: string): Promise<Alert | null> {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      alert.acknowledged_by = acknowledgedBy
      alert.acknowledged_at = new Date()
    }
    return alert || null
  },

  async resolveAlert(alertId: number): Promise<Alert | null> {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.resolved = true
      alert.resolved_at = new Date()
    }
    return alert || null
  },

  // Vehicle Status
  async getVehicleStatus(): Promise<VehicleLatestStatus[]> {
    return vehicles.map((vehicle) => {
      const latestTelemetry = telemetry
        .filter((t) => t.vehicle_id === vehicle.vehicle_id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

      const unacknowledgedAlerts = alerts.filter((a) => a.vehicle_id === vehicle.vehicle_id && !a.acknowledged).length

      return {
        vehicle_id: vehicle.vehicle_id,
        vehicle_type: vehicle.vehicle_type,
        vehicle_status: vehicle.status,
        last_update: latestTelemetry?.timestamp,
        latitude: latestTelemetry?.latitude,
        longitude: latestTelemetry?.longitude,
        speed: latestTelemetry?.speed,
        engine_temperature: latestTelemetry?.engine_temperature,
        fuel_level: latestTelemetry?.fuel_level,
        odometer: latestTelemetry?.odometer,
        engine_status: latestTelemetry?.engine_status,
        battery_voltage: latestTelemetry?.battery_voltage,
        unacknowledged_alerts: unacknowledgedAlerts,
      }
    })
  },
}
