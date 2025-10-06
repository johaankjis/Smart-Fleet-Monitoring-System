import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Telemetry, TelemetryPayload } from "@/lib/db-schema"
import { AnalyticsEngine } from "@/lib/analytics"

// GET /api/telemetry - Get telemetry data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleId = searchParams.get("vehicleId") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const telemetry = await db.getTelemetry(vehicleId, limit)

    const response: ApiResponse<Telemetry[]> = {
      success: true,
      data: telemetry,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch telemetry",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/telemetry - Ingest telemetry data (simulates Kafka consumer)
export async function POST(request: NextRequest) {
  try {
    const body: TelemetryPayload = await request.json()

    // Validate required fields
    if (!body.vehicle_id || !body.timestamp) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Missing required fields: vehicle_id, timestamp",
        timestamp: new Date().toISOString(),
      }
      return NextResponse.json(response, { status: 400 })
    }

    const telemetry = await db.createTelemetry(body)

    await AnalyticsEngine.processAndAlert(body)

    const response: ApiResponse<Telemetry> = {
      success: true,
      data: telemetry,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ingest telemetry",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
