import { NextRequest, NextResponse } from "next/server";
import { freezeAgent } from "@/lib/store";

// POST /api/agents/[id]/freeze — Freeze an agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required to freeze an agent" },
        { status: 400 }
      );
    }

    const result = freezeAgent(id, reason);

    if (!result.agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agent: result.agent,
      alert: result.alert,
      message: `Agent ${result.agent.name} has been frozen.`,
    });
  } catch (error) {
    console.error("POST /api/agents/[id]/freeze error:", error);
    return NextResponse.json(
      { error: "Failed to freeze agent" },
      { status: 500 }
    );
  }
}
