import { NextResponse } from "next/server"
import { AnalyticsEngine } from "@/lib/analytics"
import type { ApiResponse } from "@/lib/db-schema"

// GET /api/analytics/stats - Get fleet-wide statistics
export async function GET() {
  try {
    const stats = await AnalyticsEngine.calculateFleetStats()

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to calculate stats",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
