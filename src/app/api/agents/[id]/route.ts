import { NextRequest, NextResponse } from "next/server";
import { getAgent, getRecentTransactions, updateAgent, freezeAgent } from "@/lib/store";

// GET /api/agents/[id] — Get single agent with recent transactions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = getAgent(id);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    const transactions = getRecentTransactions(id, 10);

    return NextResponse.json({ agent, transactions });
  } catch (error) {
    console.error("GET /api/agents/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

// PUT /api/agents/[id]/limits — Update agent limits
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Route is /api/agents/[id] — check if body has limits fields
    const body = await request.json();
    const { dailyLimit, stakeAmount } = body;

    if (!dailyLimit && !stakeAmount) {
      return NextResponse.json(
        { error: "No fields to update. Provide dailyLimit or stakeAmount." },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};
    if (dailyLimit) updates.dailyLimit = dailyLimit;
    if (stakeAmount) updates.stakeAmount = stakeAmount;

    const agent = updateAgent(id, updates);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ agent });
  } catch (error) {
    console.error("PUT /api/agents/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}
