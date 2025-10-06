"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VehicleStatusCard } from "./vehicle-status-card"
import { TelemetryChart } from "./telemetry-chart"
import { AlertsList } from "./alerts-list"
import { FleetStats } from "./fleet-stats"
import { AlertNotifications } from "./alert-notifications"
import type { VehicleLatestStatus, Alert, ApiResponse } from "@/lib/db-schema"
import { Activity, AlertTriangle, Bell, Truck } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FleetDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  // Fetch vehicle status with auto-refresh every 5 seconds
  const { data: statusData, error: statusError } = useSWR<ApiResponse<VehicleLatestStatus[]>>("/api/status", fetcher, {
    refreshInterval: 5000,
  })

  // Fetch alerts with auto-refresh
  const { data: alertsData } = useSWR<ApiResponse<Alert[]>>("/api/alerts?acknowledged=false", fetcher, {
    refreshInterval: 5000,
  })

  const vehicles = statusData?.data || []
  const alerts = alertsData?.data || []
  const criticalAlerts = alerts.filter((a) => a.severity === "critical")
  const highAlerts = alerts.filter((a) => a.severity === "high")

  // Auto-select first vehicle if none selected
  useEffect(() => {
    if (!selectedVehicle && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].vehicle_id)
    }
  }, [vehicles, selectedVehicle])

  if (statusError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            <CardDescription>Failed to fetch fleet data. Please try again.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AlertNotifications />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Fleet Monitoring System</h1>
              <p className="text-sm text-muted-foreground">Real-time IoT Vehicle Telemetry</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
            <Link href="/alerts">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Bell className="h-4 w-4" />
                Alerts
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                    {alerts.length}
                  </Badge>
                )}
              </Button>
            </Link>
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {criticalAlerts.length} Critical
              </Badge>
            )}
            {highAlerts.length > 0 && (
              <Badge variant="default" className="gap-1 bg-accent text-accent-foreground">
                {highAlerts.length} High Priority
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          {/* Fleet Statistics */}
          <FleetStats />

          {/* Vehicle Grid */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Fleet Vehicles</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {vehicles.map((vehicle) => (
                <VehicleStatusCard
                  key={vehicle.vehicle_id}
                  vehicle={vehicle}
                  isSelected={selectedVehicle === vehicle.vehicle_id}
                  onClick={() => setSelectedVehicle(vehicle.vehicle_id)}
                />
              ))}
            </div>
          </div>

          {/* Selected Vehicle Details */}
          {selectedVehicle && (
            <div className="grid gap-6 lg:grid-cols-2">
              <TelemetryChart vehicleId={selectedVehicle} />
              <AlertsList vehicleId={selectedVehicle} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
