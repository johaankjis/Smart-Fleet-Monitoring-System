// Analytics Engine - Simulates AWS Lambda event-driven analytics
// Detects anomalies and generates alerts based on telemetry data

import type { TelemetryPayload } from "./db-schema"
import { db } from "./db"

export interface AnomalyDetectionResult {
  hasAnomaly: boolean
  anomalies: {
    type: string
    severity: "critical" | "high" | "medium" | "low"
    message: string
  }[]
}

export class AnalyticsEngine {
  // Thresholds for anomaly detection
  private static readonly THRESHOLDS = {
    ENGINE_TEMP_CRITICAL: 110, // °C
    ENGINE_TEMP_HIGH: 105,
    ENGINE_TEMP_WARNING: 100,
    FUEL_LEVEL_CRITICAL: 10, // %
    FUEL_LEVEL_LOW: 15,
    SPEED_LIMIT: 100, // km/h
    SPEED_EXCESSIVE: 120,
    TIRE_PRESSURE_LOW: 28, // PSI
    TIRE_PRESSURE_HIGH: 36,
    BATTERY_VOLTAGE_LOW: 12.0, // V
    BATTERY_VOLTAGE_HIGH: 14.8,
  }

  /**
   * Analyze telemetry data for anomalies
   * This simulates AWS Lambda processing events
   */
  static async analyzeTelemetry(telemetry: TelemetryPayload): Promise<AnomalyDetectionResult> {
    const anomalies: AnomalyDetectionResult["anomalies"] = []

    // 1. Engine Temperature Analysis
    if (telemetry.engine_temperature >= this.THRESHOLDS.ENGINE_TEMP_CRITICAL) {
      anomalies.push({
        type: "overheating_critical",
        severity: "critical",
        message: `CRITICAL: Engine temperature at ${telemetry.engine_temperature}°C. Immediate shutdown recommended.`,
      })
    } else if (telemetry.engine_temperature >= this.THRESHOLDS.ENGINE_TEMP_HIGH) {
      anomalies.push({
        type: "overheating_high",
        severity: "high",
        message: `Engine temperature at ${telemetry.engine_temperature}°C. Pull over and let engine cool.`,
      })
    } else if (telemetry.engine_temperature >= this.THRESHOLDS.ENGINE_TEMP_WARNING) {
      anomalies.push({
        type: "overheating_warning",
        severity: "medium",
        message: `Engine temperature elevated at ${telemetry.engine_temperature}°C. Monitor closely.`,
      })
    }

    // 2. Fuel Level Analysis
    if (telemetry.fuel_level <= this.THRESHOLDS.FUEL_LEVEL_CRITICAL) {
      anomalies.push({
        type: "fuel_critical",
        severity: "critical",
        message: `CRITICAL: Fuel level at ${telemetry.fuel_level}%. Refuel immediately.`,
      })
    } else if (telemetry.fuel_level <= this.THRESHOLDS.FUEL_LEVEL_LOW) {
      anomalies.push({
        type: "fuel_low",
        severity: "high",
        message: `Fuel level at ${telemetry.fuel_level}%. Refueling recommended.`,
      })
    }

    // 3. Speed Analysis
    if (telemetry.speed >= this.THRESHOLDS.SPEED_EXCESSIVE) {
      anomalies.push({
        type: "speed_excessive",
        severity: "critical",
        message: `CRITICAL: Vehicle speed at ${telemetry.speed} km/h. Excessive speed detected.`,
      })
    } else if (telemetry.speed >= this.THRESHOLDS.SPEED_LIMIT) {
      anomalies.push({
        type: "speed_violation",
        severity: "medium",
        message: `Vehicle exceeding speed limit at ${telemetry.speed} km/h.`,
      })
    }

    // 4. Tire Pressure Analysis
    const tirePressures = [
      { name: "Front Left", value: telemetry.tire_pressure.front_left },
      { name: "Front Right", value: telemetry.tire_pressure.front_right },
      { name: "Rear Left", value: telemetry.tire_pressure.rear_left },
      { name: "Rear Right", value: telemetry.tire_pressure.rear_right },
    ]

    for (const tire of tirePressures) {
      if (tire.value < this.THRESHOLDS.TIRE_PRESSURE_LOW) {
        anomalies.push({
          type: "tire_pressure_low",
          severity: "medium",
          message: `${tire.name} tire pressure low at ${tire.value} PSI.`,
        })
      } else if (tire.value > this.THRESHOLDS.TIRE_PRESSURE_HIGH) {
        anomalies.push({
          type: "tire_pressure_high",
          severity: "low",
          message: `${tire.name} tire pressure high at ${tire.value} PSI.`,
        })
      }
    }

    // 5. Battery Voltage Analysis
    if (telemetry.battery_voltage < this.THRESHOLDS.BATTERY_VOLTAGE_LOW) {
      anomalies.push({
        type: "battery_low",
        severity: "high",
        message: `Battery voltage low at ${telemetry.battery_voltage}V. Check charging system.`,
      })
    } else if (telemetry.battery_voltage > this.THRESHOLDS.BATTERY_VOLTAGE_HIGH) {
      anomalies.push({
        type: "battery_high",
        severity: "medium",
        message: `Battery voltage high at ${telemetry.battery_voltage}V. Possible overcharging.`,
      })
    }

    // 6. Combined Risk Analysis
    if (
      telemetry.engine_temperature > this.THRESHOLDS.ENGINE_TEMP_WARNING &&
      telemetry.speed > this.THRESHOLDS.SPEED_LIMIT
    ) {
      anomalies.push({
        type: "combined_risk",
        severity: "high",
        message: `High risk: Elevated temperature (${telemetry.engine_temperature}°C) combined with high speed (${telemetry.speed} km/h).`,
      })
    }

    return {
      hasAnomaly: anomalies.length > 0,
      anomalies,
    }
  }

  /**
   * Process telemetry and create alerts if anomalies detected
   * This is called automatically when telemetry is ingested
   */
  static async processAndAlert(telemetry: TelemetryPayload): Promise<void> {
    const result = await this.analyzeTelemetry(telemetry)

    if (result.hasAnomaly) {
      // Create alerts for each anomaly
      for (const anomaly of result.anomalies) {
        await db.createAlert({
          vehicle_id: telemetry.vehicle_id,
          alert_type: anomaly.type,
          severity: anomaly.severity,
          message: anomaly.message,
        })
      }

      console.log(`[Analytics] Detected ${result.anomalies.length} anomalies for ${telemetry.vehicle_id}`)
    }
  }

  /**
   * Calculate fleet-wide statistics
   */
  static async calculateFleetStats() {
    const vehicles = await db.getVehicles()
    const status = await db.getVehicleStatus()
    const alerts = await db.getAlerts()

    const stats = {
      total_vehicles: vehicles.length,
      active_vehicles: vehicles.filter((v) => v.status === "active").length,
      maintenance_vehicles: vehicles.filter((v) => v.status === "maintenance").length,
      total_alerts: alerts.length,
      critical_alerts: alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length,
      high_alerts: alerts.filter((a) => a.severity === "high" && !a.acknowledged).length,
      average_speed: status.reduce((sum, s) => sum + (s.speed || 0), 0) / status.filter((s) => s.speed).length || 0,
      average_fuel:
        status.reduce((sum, s) => sum + (s.fuel_level || 0), 0) / status.filter((s) => s.fuel_level).length || 0,
      average_temp:
        status.reduce((sum, s) => sum + (s.engine_temperature || 0), 0) /
          status.filter((s) => s.engine_temperature).length || 0,
      vehicles_with_alerts: new Set(alerts.filter((a) => !a.acknowledged).map((a) => a.vehicle_id)).size,
    }

    return stats
  }

  /**
   * Predict maintenance needs based on telemetry patterns
   */
  static async predictMaintenance(vehicleId: string): Promise<{
    maintenanceNeeded: boolean
    reasons: string[]
    estimatedDays: number
  }> {
    const telemetryData = await db.getTelemetry(vehicleId, 100)
    const vehicle = await db.getVehicle(vehicleId)

    const reasons: string[] = []
    let maintenanceNeeded = false
    let estimatedDays = 90 // Default 90 days

    if (!telemetryData.length || !vehicle) {
      return { maintenanceNeeded: false, reasons: [], estimatedDays }
    }

    // Check average engine temperature trend
    const avgTemp = telemetryData.reduce((sum, t) => sum + (t.engine_temperature || 0), 0) / telemetryData.length
    if (avgTemp > 95) {
      maintenanceNeeded = true
      reasons.push("Consistently high engine temperature indicates cooling system issues")
      estimatedDays = Math.min(estimatedDays, 30)
    }

    // Check odometer
    if (vehicle.odometer && vehicle.odometer > 150000) {
      maintenanceNeeded = true
      reasons.push("High mileage vehicle requires more frequent maintenance")
      estimatedDays = Math.min(estimatedDays, 60)
    }

    // Check battery voltage trends
    const avgBattery = telemetryData.reduce((sum, t) => sum + (t.battery_voltage || 0), 0) / telemetryData.length
    if (avgBattery < 12.5) {
      maintenanceNeeded = true
      reasons.push("Low battery voltage indicates charging system or battery replacement needed")
      estimatedDays = Math.min(estimatedDays, 14)
    }

    return { maintenanceNeeded, reasons, estimatedDays }
  }
}
