"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import type { ApiResponse, Telemetry } from "@/lib/db-schema"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface TelemetryChartProps {
  vehicleId: string
}

export function TelemetryChart({ vehicleId }: TelemetryChartProps) {
  const { data } = useSWR<ApiResponse<Telemetry[]>>(`/api/telemetry?vehicleId=${vehicleId}&limit=50`, fetcher, {
    refreshInterval: 5000,
  })

  const telemetry = data?.data || []

  // Prepare chart data (reverse to show oldest to newest)
  const chartData = [...telemetry]
    .reverse()
    .map((t) => ({
      time: new Date(t.timestamp).toLocaleTimeString(),
      speed: t.speed || 0,
      temperature: t.engine_temperature || 0,
      fuel: t.fuel_level || 0,
    }))
    .slice(-20) // Show last 20 data points

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Telemetry Data</CardTitle>
        <CardDescription className="text-muted-foreground">Real-time sensor readings for {vehicleId}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
            <XAxis dataKey="time" stroke="oklch(0.65 0 0)" style={{ fontSize: "12px" }} />
            <YAxis stroke="oklch(0.65 0 0)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="oklch(0.65 0.22 250)"
              name="Speed (km/h)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="oklch(0.68 0.19 35)"
              name="Temp (°C)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="fuel"
              stroke="oklch(0.70 0.18 160)"
              name="Fuel (%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
