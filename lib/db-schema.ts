// TypeScript types matching the database schema
// Use these types throughout the application for type safety

export interface Vehicle {
  vehicle_id: string
  vehicle_type: string
  make?: string
  model?: string
  year?: number
  vin?: string
  license_plate?: string
  status: "active" | "maintenance" | "inactive"
  last_maintenance_date?: Date
  next_maintenance_date?: Date
  odometer?: number
  created_at: Date
  updated_at: Date
}

export interface Telemetry {
  id: number
  vehicle_id: string
  timestamp: Date
  latitude?: number
  longitude?: number
  speed?: number
  engine_temperature?: number
  fuel_level?: number
  odometer?: number
  engine_status?: "normal" | "overheating" | "low_fuel" | "high_speed" | "maintenance_required"
  tire_pressure_fl?: number
  tire_pressure_fr?: number
  tire_pressure_rl?: number
  tire_pressure_rr?: number
  battery_voltage?: number
  created_at: Date
}

export interface Alert {
  id: number
  vehicle_id: string
  alert_type: string
  severity: "critical" | "high" | "medium" | "low"
  message: string
  telemetry_id?: number
  acknowledged: boolean
  acknowledged_by?: string
  acknowledged_at?: Date
  resolved: boolean
  resolved_at?: Date
  created_at: Date
}

export interface VehicleLatestStatus {
  vehicle_id: string
  vehicle_type: string
  vehicle_status: string
  last_update?: Date
  latitude?: number
  longitude?: number
  speed?: number
  engine_temperature?: number
  fuel_level?: number
  odometer?: number
  engine_status?: string
  battery_voltage?: number
  unacknowledged_alerts: number
}

export interface CriticalAlert {
  id: number
  vehicle_id: string
  vehicle_type: string
  alert_type: string
  severity: "critical" | "high"
  message: string
  acknowledged: boolean
  created_at: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface TelemetryPayload {
  vehicle_id: string
  vehicle_type: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
  }
  speed: number
  engine_temperature: number
  fuel_level: number
  odometer: number
  engine_status: string
  tire_pressure: {
    front_left: number
    front_right: number
    rear_left: number
    rear_right: number
  }
  battery_voltage: number
}
