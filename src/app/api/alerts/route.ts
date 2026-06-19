import { NextRequest, NextResponse } from "next/server";
import { getAlerts } from "@/lib/store";

// GET /api/alerts — List alerts
// Query params: ?agentId=xxx&resolved=true|false
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId") || undefined;
    const resolvedParam = searchParams.get("resolved");

    let resolved: boolean | undefined;
    if (resolvedParam === "true") resolved = true;
    else if (resolvedParam === "false") resolved = false;

    const alerts = getAlerts(agentId, resolved);

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("GET /api/alerts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
