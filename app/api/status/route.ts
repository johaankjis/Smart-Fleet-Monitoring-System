import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, VehicleLatestStatus } from "@/lib/db-schema"

// GET /api/status - Get latest status for all vehicles
export async function GET() {
  try {
    const status = await db.getVehicleStatus()

    const response: ApiResponse<VehicleLatestStatus[]> = {
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch vehicle status",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
