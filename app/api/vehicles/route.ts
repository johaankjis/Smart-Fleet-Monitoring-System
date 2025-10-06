import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Vehicle } from "@/lib/db-schema"

// GET /api/vehicles - Get all vehicles
export async function GET() {
  try {
    const vehicles = await db.getVehicles()

    const response: ApiResponse<Vehicle[]> = {
      success: true,
      data: vehicles,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch vehicles",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const vehicle = await db.createVehicle(body)

    const response: ApiResponse<Vehicle> = {
      success: true,
      data: vehicle,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create vehicle",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
