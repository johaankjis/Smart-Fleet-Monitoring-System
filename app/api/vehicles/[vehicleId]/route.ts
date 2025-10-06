import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Vehicle } from "@/lib/db-schema"

// GET /api/vehicles/:vehicleId - Get a specific vehicle
export async function GET(request: NextRequest, { params }: { params: Promise<{ vehicleId: string }> }) {
  try {
    const { vehicleId } = await params
    const vehicle = await db.getVehicle(vehicleId)

    if (!vehicle) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Vehicle not found",
        timestamp: new Date().toISOString(),
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Vehicle> = {
      success: true,
      data: vehicle,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch vehicle",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
