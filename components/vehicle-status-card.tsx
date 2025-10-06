"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VehicleLatestStatus } from "@/lib/db-schema"
import { AlertTriangle, Fuel, Gauge, ThermometerSun, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleStatusCardProps {
  vehicle: VehicleLatestStatus
  isSelected: boolean
  onClick: () => void
}

export function VehicleStatusCard({ vehicle, isSelected, onClick }: VehicleStatusCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "overheating":
        return "text-destructive"
      case "low_fuel":
        return "text-accent"
      case "high_speed":
        return "text-accent"
      default:
        return "text-primary"
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "overheating":
        return <Badge variant="destructive">Overheating</Badge>
      case "low_fuel":
        return <Badge className="bg-accent text-accent-foreground">Low Fuel</Badge>
      case "high_speed":
        return <Badge variant="secondary">High Speed</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary",
        isSelected && "border-primary bg-card/80 ring-1 ring-primary",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Truck className={cn("h-4 w-4", getStatusColor(vehicle.engine_status))} />
            <span className="font-mono text-sm font-semibold text-foreground">{vehicle.vehicle_id}</span>
          </div>
          {vehicle.unacknowledged_alerts > 0 && (
            <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-xs">
              <AlertTriangle className="h-3 w-3" />
              {vehicle.unacknowledged_alerts}
            </Badge>
          )}
        </div>

        <div className="mb-3 text-xs text-muted-foreground">{vehicle.vehicle_type}</div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-3 w-3" />
              <span>Speed</span>
            </div>
            <span className="font-mono text-foreground">{vehicle.speed?.toFixed(0) || 0} km/h</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ThermometerSun className="h-3 w-3" />
              <span>Temp</span>
            </div>
            <span
              className={cn(
                "font-mono",
                vehicle.engine_temperature && vehicle.engine_temperature > 100 ? "text-destructive" : "text-foreground",
              )}
            >
              {vehicle.engine_temperature?.toFixed(0) || 0}°C
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Fuel className="h-3 w-3" />
              <span>Fuel</span>
            </div>
            <span
              className={cn(
                "font-mono",
                vehicle.fuel_level && vehicle.fuel_level < 15 ? "text-accent" : "text-foreground",
              )}
            >
              {vehicle.fuel_level?.toFixed(0) || 0}%
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">{getStatusBadge(vehicle.engine_status)}</div>
      </CardContent>
    </Card>
  )
}
