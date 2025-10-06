import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Alert } from "@/lib/db-schema"

// POST /api/alerts/:alertId/acknowledge - Acknowledge an alert
export async function POST(request: NextRequest, { params }: { params: Promise<{ alertId: string }> }) {
  try {
    const { alertId } = await params
    const body = await request.json()
    const { acknowledged_by } = body

    const alert = await db.acknowledgeAlert(Number.parseInt(alertId), acknowledged_by || "system")

    if (!alert) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Alert> = {
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to acknowledge alert",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
