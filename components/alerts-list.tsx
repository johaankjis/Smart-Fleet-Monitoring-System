"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApiResponse, Alert } from "@/lib/db-schema"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AlertsListProps {
  vehicleId: string
}

export function AlertsList({ vehicleId }: AlertsListProps) {
  const { data, mutate } = useSWR<ApiResponse<Alert[]>>(`/api/alerts?vehicleId=${vehicleId}`, fetcher, {
    refreshInterval: 5000,
  })

  const alerts = data?.data || []

  const handleAcknowledge = async (alertId: number) => {
    try {
      await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledged_by: "Fleet Manager" }),
      })
      mutate()
    } catch (error) {
      console.error("Failed to acknowledge alert:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Alerts</CardTitle>
        <CardDescription className="text-muted-foreground">Active alerts for {vehicleId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">No alerts for this vehicle</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 ${alert.severity === "critical" ? "text-destructive" : "text-accent"}`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.alert_type}</span>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                    Acknowledge
                  </Button>
                )}
                {alert.acknowledged && (
                  <Badge variant="outline" className="text-xs">
                    Acknowledged
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
