import { NextRequest, NextResponse } from "next/server";
import { resolveAlert } from "@/lib/store";

// POST /api/alerts/[id]/resolve — Resolve an alert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = resolveAlert(id);

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      alert,
      message: `Alert ${id.slice(0, 8)}... resolved.`,
    });
  } catch (error) {
    console.error("POST /api/alerts/[id]/resolve error:", error);
    return NextResponse.json(
      { error: "Failed to resolve alert" },
      { status: 500 }
    );
  }
}

// GET /api/alerts/[id] — Get single alert
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getAlerts } = await import("@/lib/store");
    const alerts = getAlerts();
    const alert = alerts.find((a) => a.id === id);

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("GET /api/alerts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alert" },
      { status: 500 }
    );
  }
}
