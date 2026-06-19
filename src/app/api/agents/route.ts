import { NextRequest, NextResponse } from "next/server";
import { getAllAgents, createAgent } from "@/lib/store";

// GET /api/agents — List all agents
export async function GET() {
  try {
    const agents = getAllAgents();
    return NextResponse.json({ agents });
  } catch (error) {
    console.error("GET /api/agents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

// POST /api/agents — Register a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, id, owner, stakeAmount, dailyLimit } = body;

    if (!name || !id || !owner) {
      return NextResponse.json(
        { error: "Missing required fields: name, id, owner" },
        { status: 400 }
      );
    }

    const existing = getAllAgents().find((a) => a.id === id);
    if (existing) {
      return NextResponse.json(
        { error: "Agent already registered", agent: existing },
        { status: 409 }
      );
    }

    const agent = createAgent({
      id,
      name,
      owner,
      stakeAmount: stakeAmount || "1000000000", // 10 CSPR default
      dailyLimit: dailyLimit || "50000000000",  // 500 CSPR default
    });

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error("POST /api/agents error:", error);
    return NextResponse.json(
      { error: "Failed to register agent" },
      { status: 500 }
    );
  }
}
