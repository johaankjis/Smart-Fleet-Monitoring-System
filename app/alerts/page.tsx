"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ApiResponse, Alert } from "@/lib/db-schema"
import { AlertTriangle, CheckCircle2, Clock, Filter, Truck, XCircle } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  const { data: allAlertsData, mutate } = useSWR<ApiResponse<Alert[]>>("/api/alerts", fetcher, {
    refreshInterval: 5000,
  })

  const { data: unacknowledgedData } = useSWR<ApiResponse<Alert[]>>("/api/alerts?acknowledged=false", fetcher, {
    refreshInterval: 5000,
  })

  const allAlerts = allAlertsData?.data || []
  const unacknowledgedAlerts = unacknowledgedData?.data || []
  const acknowledgedAlerts = allAlerts.filter((a) => a.acknowledged)

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

  const handleAcknowledgeAll = async () => {
    try {
      await Promise.all(
        unacknowledgedAlerts.map((alert) =>
          fetch(`/api/alerts/${alert.id}/acknowledge`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ acknowledged_by: "Fleet Manager" }),
          }),
        ),
      )
      mutate()
    } catch (error) {
      console.error("Failed to acknowledge alerts:", error)
    }
  }

  const filterAlerts = (alerts: Alert[]) => {
    if (filter === "all") return alerts
    return alerts.filter((a) => a.severity === filter)
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-accent" />
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Truck className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Alert Management</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage fleet alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {unacknowledgedAlerts.length > 0 && (
              <Button onClick={handleAcknowledgeAll} variant="outline" size="sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Acknowledge All ({unacknowledgedAlerts.length})
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{allAlerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unacknowledged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{unacknowledgedAlerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {allAlerts.filter((a) => a.severity === "critical" && !a.acknowledged).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {allAlerts.filter((a) => a.severity === "high" && !a.acknowledged).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Filter Alerts</CardTitle>
                <CardDescription className="text-muted-foreground">Filter by severity level</CardDescription>
              </div>
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("critical")}
              >
                Critical
              </Button>
              <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>
                High
              </Button>
              <Button
                variant={filter === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("medium")}
              >
                Medium
              </Button>
              <Button variant={filter === "low" ? "default" : "outline"} size="sm" onClick={() => setFilter("low")}>
                Low
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Tabs */}
        <Tabs defaultValue="unacknowledged" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unacknowledged">Unacknowledged ({unacknowledgedAlerts.length})</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="unacknowledged" className="mt-6">
            <div className="space-y-3">
              {filterAlerts(unacknowledgedAlerts).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
                    <p className="text-lg font-medium text-foreground">No unacknowledged alerts</p>
                    <p className="text-sm text-muted-foreground">All alerts have been acknowledged</p>
                  </CardContent>
                </Card>
              ) : (
                filterAlerts(unacknowledgedAlerts).map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-destructive">
                    <CardContent className="flex items-start gap-4 p-4">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <span className="font-mono text-sm font-semibold text-foreground">{alert.vehicle_id}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{alert.alert_type}</span>
                        </div>
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAcknowledge(alert.id)}>
                        Acknowledge
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="acknowledged" className="mt-6">
            <div className="space-y-3">
              {filterAlerts(acknowledgedAlerts).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="mb-4 h-16 w-16 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground">No acknowledged alerts</p>
                    <p className="text-sm text-muted-foreground">Acknowledged alerts will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                filterAlerts(acknowledgedAlerts).map((alert) => (
                  <Card key={alert.id} className="opacity-60">
                    <CardContent className="flex items-start gap-4 p-4">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <span className="font-mono text-sm font-semibold text-foreground">{alert.vehicle_id}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{alert.alert_type}</span>
                        </div>
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Created: {new Date(alert.created_at).toLocaleString()}
                          </div>
                          {alert.acknowledged_at && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Acknowledged: {new Date(alert.acknowledged_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
