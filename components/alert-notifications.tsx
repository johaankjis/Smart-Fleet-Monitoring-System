"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import type { ApiResponse, Alert } from "@/lib/db-schema"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AlertNotifications() {
  const previousAlertsRef = useRef<Set<number>>(new Set())

  const { data } = useSWR<ApiResponse<Alert[]>>("/api/alerts?acknowledged=false", fetcher, {
    refreshInterval: 3000,
  })

  const alerts = data?.data || []

  useEffect(() => {
    // Check for new alerts
    const currentAlertIds = new Set(alerts.map((a) => a.id))

    alerts.forEach((alert) => {
      // If this is a new alert we haven't seen before
      if (!previousAlertsRef.current.has(alert.id)) {
        // Show toast notification based on severity
        if (alert.severity === "critical") {
          toast.error(`${alert.vehicle_id}: ${alert.message}`, {
            duration: 10000,
            description: `Critical alert - ${alert.alert_type}`,
          })
        } else if (alert.severity === "high") {
          toast.warning(`${alert.vehicle_id}: ${alert.message}`, {
            duration: 7000,
            description: `High priority - ${alert.alert_type}`,
          })
        } else {
          toast.info(`${alert.vehicle_id}: ${alert.message}`, {
            duration: 5000,
            description: alert.alert_type,
          })
        }
      }
    })

    // Update the reference to current alerts
    previousAlertsRef.current = currentAlertIds
  }, [alerts])

  return null
}
