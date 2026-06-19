import { NextRequest, NextResponse } from "next/server";
import { getAgent, getRecentTransactions, getTotalSpentToday, recordTransaction, createAlert, updateAgent } from "@/lib/store";
import { analyzeTransaction, quickCheck } from "@/lib/guardian";

// POST /api/monitor — Analyze a transaction for anomalies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, transaction } = body;

    if (!agentId || !transaction) {
      return NextResponse.json(
        { error: "Missing required fields: agentId, transaction" },
        { status: 400 }
      );
    }

    const { from, to, amount, hash } = transaction;
    if (!from || !to || !amount || !hash) {
      return NextResponse.json(
        { error: "Transaction must include: from, to, amount, hash" },
        { status: 400 }
      );
    }

    // Verify agent exists and is active
    const agent = getAgent(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    if (agent.status === "frozen") {
      return NextResponse.json({
        decision: "freeze",
        reasoning: `Agent ${agent.name} is already frozen`,
        riskScore: 100,
        agentStatus: agent.status,
      });
    }

    // Build guardian input
    const recentTxs = getRecentTransactions(agentId, 10);
    const totalSpent = getTotalSpentToday(agentId);

    const guardianInput = {
      agentId,
      agentName: agent.name,
      dailyLimit: agent.dailyLimit,
      transaction: { from, to, amount, hash },
      recentTransactions: recentTxs.map((tx) => ({
        to: tx.to,
        amount: tx.amount,
        timestamp: tx.timestamp,
      })),
      totalSpentToday: totalSpent,
    };

    // Run guardian analysis
    // Use deterministic quickCheck for demo, full Claude analysis for production
    const useQuickCheck = process.env.GUARDIAN_MODE === "quick" || !process.env.ANTHROPIC_API_KEY;
    
    let decision;
    if (useQuickCheck) {
      decision = quickCheck(guardianInput);
    } else {
      decision = await analyzeTransaction(guardianInput);
    }

    // Record the transaction
    const txRecord = recordTransaction({
      hash,
      agentId,
      from,
      to,
      amount,
      status: decision.decision === "freeze" ? "frozen" :
              decision.decision === "flag" ? "flagged" : "allowed",
      guardianReasoning: decision.reasoning,
    });

    // If freeze: update agent status, create alert
    let alert;
    if (decision.decision === "freeze") {
      updateAgent(agentId, {
        status: "frozen",
        healthScore: Math.max(0, agent.healthScore - 30),
      });

      alert = createAlert({
        agentId,
        transactionHash: hash,
        severity: "critical",
        reason: decision.reasoning,
        action: "freeze",
      });
    }

    // If flag: create warning alert
    if (decision.decision === "flag") {
      alert = createAlert({
        agentId,
        transactionHash: hash,
        severity: "warning",
        reason: decision.reasoning,
        action: "flag",
      });
    }

    return NextResponse.json({
      decision: decision.decision,
      reasoning: decision.reasoning,
      riskScore: decision.riskScore,
      agentStatus: agent.status,
      transaction: txRecord,
      ...(alert && { alert }),
    });
  } catch (error) {
    console.error("POST /api/monitor error:", error);
    return NextResponse.json(
      { error: "Failed to analyze transaction" },
      { status: 500 }
    );
  }
}
