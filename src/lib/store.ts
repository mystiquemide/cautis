// In-memory data store for Cautis MVP
// No database — all persistent state is on-chain via Casper Testnet
// This store holds API-accessible copies for dashboard + monitoring

import { randomUUID } from "crypto";

// Lazy seed — ensures demo data is available even across module contexts
let seeded = false;

function ensureSeed() {
  if (seeded) return;
  seeded = true;
  
  // Agent A
  createAgent({
    id: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    name: "Yield Scout Alpha",
    owner: "019a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    stakeAmount: "5000000000",
    dailyLimit: "100000000000",
  });
  // Agent B
  createAgent({
    id: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    name: "Liquidity Manager Beta",
    owner: "019a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    stakeAmount: "10000000000",
    dailyLimit: "50000000000",
  });
  // Agent C
  createAgent({
    id: "0202b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    name: "Arbitrage Sweeper",
    owner: "019b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    stakeAmount: "2500000000",
    dailyLimit: "20000000000",
  });
  console.log("[Cautis] Lazy seed: 3 agents loaded");
}

// ---- Types ----

export interface Agent {
  id: string;             // Casper public key
  name: string;
  owner: string;          // Operator public key
  stakeAmount: string;    // CSPR motes staked
  dailyLimit: string;     // CSPR motes per day
  status: "active" | "frozen" | "paused";
  healthScore: number;    // 0-100
  createdAt: string;      // ISO timestamp
}

export interface Transaction {
  hash: string;
  agentId: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: "allowed" | "flagged" | "frozen";
  guardianReasoning: string;
}

export interface Alert {
  id: string;
  agentId: string;
  transactionHash: string;
  severity: "warning" | "critical";
  reason: string;
  action: "flag" | "freeze";
  resolved: boolean;
  createdAt: string;
}

// ---- In-Memory Store ----

const agents: Map<string, Agent> = new Map();
const transactions: Transaction[] = [];
const alerts: Alert[] = [];

// ---- Agent Operations ----

export function createAgent(data: Omit<Agent, "createdAt" | "healthScore" | "status">): Agent {
  const agent: Agent = {
    ...data,
    status: "active",
    healthScore: 100,
    createdAt: new Date().toISOString(),
  };
  agents.set(agent.id, agent);
  return agent;
}

export function getAgent(id: string): Agent | undefined {
  return agents.get(id);
}

export function getAllAgents(): Agent[] {
  ensureSeed();
  return Array.from(agents.values());
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
  const agent = agents.get(id);
  if (!agent) return undefined;
  Object.assign(agent, updates);
  return agent;
}

export function freezeAgent(id: string, reason: string): { agent?: Agent; alert?: Alert } {
  const agent = agents.get(id);
  if (!agent) return {};

  agent.status = "frozen";
  agent.healthScore = Math.max(0, agent.healthScore - 40);

  const alert = createAlert({
    agentId: id,
    transactionHash: "manual-freeze",
    severity: "critical",
    reason,
    action: "freeze",
  });

  return { agent, alert };
}

// ---- Transaction Operations ----

export function recordTransaction(data: Omit<Transaction, "timestamp">): Transaction {
  const tx: Transaction = {
    ...data,
    timestamp: new Date().toISOString(),
  };
  transactions.unshift(tx);
  return tx;
}

export function getRecentTransactions(agentId?: string, limit = 20): Transaction[] {
  const filtered = agentId
    ? transactions.filter((tx) => tx.agentId === agentId)
    : transactions;
  return filtered.slice(0, limit);
}

export function getTotalSpentToday(agentId: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const total = transactions
    .filter(
      (tx) =>
        tx.agentId === agentId &&
        tx.timestamp.startsWith(today) &&
        tx.status !== "frozen"
    )
    .reduce((sum, tx) => sum + BigInt(tx.amount), BigInt(0));
  return total.toString();
}

// ---- Alert Operations ----

export function createAlert(data: Omit<Alert, "id" | "createdAt" | "resolved">): Alert {
  const alert: Alert = {
    ...data,
    id: randomUUID(),
    resolved: false,
    createdAt: new Date().toISOString(),
  };
  alerts.unshift(alert);
  return alert;
}

export function getAlerts(agentId?: string, resolved?: boolean): Alert[] {
  let filtered = alerts;
  if (agentId) filtered = filtered.filter((a) => a.agentId === agentId);
  if (resolved !== undefined) filtered = filtered.filter((a) => a.resolved === resolved);
  return filtered;
}

export function resolveAlert(id: string): Alert | undefined {
  const alert = alerts.find((a) => a.id === id);
  if (!alert) return undefined;
  alert.resolved = true;
  return alert;
}
