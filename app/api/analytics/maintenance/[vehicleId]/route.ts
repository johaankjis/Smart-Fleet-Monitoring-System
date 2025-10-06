import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsEngine } from "@/lib/analytics"
import type { ApiResponse } from "@/lib/db-schema"

// GET /api/analytics/maintenance/:vehicleId - Predict maintenance needs
export async function GET(request: NextRequest, { params }: { params: Promise<{ vehicleId: string }> }) {
  try {
    const { vehicleId } = await params
    const prediction = await AnalyticsEngine.predictMaintenance(vehicleId)

    const response: ApiResponse<typeof prediction> = {
      success: true,
      data: prediction,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to predict maintenance",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 500 })
  }
}
