"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApiResponse } from "@/lib/db-schema"
import { Activity, AlertTriangle, Gauge, ThermometerSun, Truck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FleetStats() {
  const { data } = useSWR<ApiResponse<any>>("/api/analytics/stats", fetcher, {
    refreshInterval: 10000,
  })

  const stats = data?.data

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.total_vehicles}</div>
          <p className="text-xs text-muted-foreground">{stats.active_vehicles} active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.critical_alerts}</div>
          <p className="text-xs text-muted-foreground">{stats.high_alerts} high priority</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Speed</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.average_speed.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">km/h</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Temperature</CardTitle>
          <ThermometerSun className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.average_temp.toFixed(0)}°C</div>
          <p className="text-xs text-muted-foreground">engine temp</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Fleet Status</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.vehicles_with_alerts}</div>
          <p className="text-xs text-muted-foreground">vehicles with alerts</p>
        </CardContent>
      </Card>
    </div>
  )
}
