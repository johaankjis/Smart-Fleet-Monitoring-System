import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Alert } from "@/lib/db-schema"

// GET /api/alerts - Get alerts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleId = searchParams.get("vehicleId") || undefined
    const acknowledged = searchParams.get("acknowledged")

    const alerts = await db.getAlerts(vehicleId, acknowledged !== null ? acknowledged === "true" : undefined)

    const response: ApiResponse<Alert[]> = {
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch alerts",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const alert = await db.createAlert(body)

    const response: ApiResponse<Alert> = {
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create alert",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
