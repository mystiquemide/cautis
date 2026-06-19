// Guardian Agent — Claude-powered anomaly detection
// Each monitoring call = fresh Claude API invocation
// Input: transaction context + agent limits + history
// Output: "allow" | "flag" | "freeze" + reasoning

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface GuardianInput {
  agentId: string;
  agentName: string;
  dailyLimit: string; // CSPR motes
  transaction: {
    from: string;
    to: string;
    amount: string; // CSPR motes
    hash: string;
  };
  recentTransactions: {
    to: string;
    amount: string;
    timestamp: string;
  }[];
  totalSpentToday: string; // CSPR motes
}

export interface GuardianDecision {
  decision: "allow" | "flag" | "freeze";
  reasoning: string;
  riskScore: number; // 0-100
}

function buildPrompt(input: GuardianInput): string {
  const recentTxList = input.recentTransactions
    .slice(0, 5)
    .map(
      (tx) =>
        `- ${tx.amount} motes → ${tx.to.slice(0, 10)}... at ${tx.timestamp}`
    )
    .join("\n");

  return `You are Cautis, a guardian AI that monitors agent transactions on Casper Network. Your job is to detect anomalies and decide whether to allow, flag, or freeze a transaction.

AGENT CONTEXT:
- Agent ID: ${input.agentId.slice(0, 12)}...
- Agent Name: ${input.agentName}
- Daily Limit: ${input.dailyLimit} motes
- Total Spent Today: ${input.totalSpentToday} motes

CURRENT TRANSACTION:
- From: ${input.transaction.from.slice(0, 12)}...
- To: ${input.transaction.to.slice(0, 12)}...
- Amount: ${input.transaction.amount} motes
- Hash: ${input.transaction.hash.slice(0, 12)}...

RECENT TRANSACTIONS (last 5):
${recentTxList || "(none)"}

RULES:
- If amount + total spent today exceeds daily limit → FREEZE
- If destination address appears for the first time AND amount is unusually large → FLAG or FREEZE
- If amount is within limits and patterns look normal → ALLOW
- If something feels suspicious but not clearly malicious → FLAG

Respond with ONLY a JSON object (no markdown, no explanation outside JSON):
{
  "decision": "allow" | "flag" | "freeze",
  "reasoning": "Brief explanation of why",
  "riskScore": 0-100
}`;
}

export async function analyzeTransaction(
  input: GuardianInput
): Promise<GuardianDecision> {
  // Deterministic pre-check: hard rule for daily limit exceeded
  const amount = BigInt(input.transaction.amount);
  const spent = BigInt(input.totalSpentToday);
  const limit = BigInt(input.dailyLimit);

  if (spent + amount > limit) {
    return {
      decision: "freeze",
      reasoning: `Daily limit exceeded. Spent ${spent} + ${amount} = ${spent + amount} > limit ${limit}`,
      riskScore: 100,
    };
  }

  // Deterministic pre-check: amount is zero
  if (amount === BigInt(0)) {
    return {
      decision: "allow",
      reasoning: "Zero-value transaction, no risk",
      riskScore: 0,
    };
  }

  // Claude-powered analysis for everything else
  const prompt = buildPrompt(input);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      temperature: 0,
      system: "You are a security-focused guardian AI. Respond only with valid JSON. No markdown. No explanation outside the JSON object.",
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "{}";

    // Parse Claude's response, strip any markdown code fences
    const jsonStr = text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    return {
      decision: parsed.decision || "flag",
      reasoning: parsed.reasoning || "Guardian analysis complete",
      riskScore: typeof parsed.riskScore === "number" ? parsed.riskScore : 50,
    };
  } catch (error) {
    // Fallback: flag if Claude API fails
    console.error("Guardian Claude API error:", error);
    return {
      decision: "flag",
      reasoning: "Guardian API unavailable, transaction flagged for review",
      riskScore: 75,
    };
  }
}

// Fast deterministic check for demo scenarios (no API call)
export function quickCheck(input: GuardianInput): GuardianDecision {
  const amount = BigInt(input.transaction.amount);
  const spent = BigInt(input.totalSpentToday);
  const limit = BigInt(input.dailyLimit);

  if (spent + amount > limit) {
    return {
      decision: "freeze",
      reasoning: `Daily limit exceeded. ${spent} + ${amount} = ${spent + amount} > ${limit}`,
      riskScore: 100,
    };
  }

  if (amount > limit / BigInt(2)) {
    return {
      decision: "flag",
      reasoning: `Large transaction: ${amount} exceeds 50% of daily limit ${limit}`,
      riskScore: 60,
    };
  }

  return {
    decision: "allow",
    reasoning: "Transaction within normal parameters",
    riskScore: 5,
  };
}
