// Seed data for Cautis demo
// Populates the in-memory store with 3 demo agents and sample transactions
// Import and call seed() before starting the server for judge demo

import { createAgent, recordTransaction } from "./store";

export function seed() {
  // Clear existing data by re-creating agents
  // (in-memory store starts fresh on each server restart)

  // Agent A — Healthy, active, normal behavior
  createAgent({
    id: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    name: "Yield Scout Alpha",
    owner: "019a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    stakeAmount: "5000000000",     // 50 CSPR
    dailyLimit: "100000000000",    // 1000 CSPR per day
  });

  // Agent B — The "victim" for the demo attack
  createAgent({
    id: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    name: "Liquidity Manager Beta",
    owner: "019a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    stakeAmount: "10000000000",    // 100 CSPR
    dailyLimit: "50000000000",     // 500 CSPR per day
  });

  // Agent C — Recently flagged, lower health
  const agentC = createAgent({
    id: "0202b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    name: "Arbitrage Sweeper",
    owner: "019b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    stakeAmount: "2500000000",     // 25 CSPR
    dailyLimit: "20000000000",     // 200 CSPR per day
  });

  // Seed some normal transactions for agent A
  recordTransaction({
    hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
    agentId: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    from: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    to: "019a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    amount: "5000000000",   // 50 CSPR
    status: "allowed",
    guardianReasoning: "Normal swap within daily limits",
  });

  recordTransaction({
    hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
    agentId: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    from: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    to: "019c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    amount: "2000000000",   // 20 CSPR
    status: "allowed",
    guardianReasoning: "Routine deposit to liquidity pool",
  });

  recordTransaction({
    hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
    agentId: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    from: "0202f3f1569e0132e227e67ecc943a0e16729318c0ca9fd5050b81b185c8cf6e317a",
    to: "019d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
    amount: "3000000000",   // 30 CSPR
    status: "allowed",
    guardianReasoning: "Routine staking operation",
  });

  // Seed some transactions for agent B (normal so far)
  recordTransaction({
    hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
    agentId: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    from: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    to: "019e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    amount: "10000000000",  // 100 CSPR
    status: "allowed",
    guardianReasoning: "Normal rebalancing operation",
  });

  recordTransaction({
    hash: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    agentId: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    from: "0202a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    to: "019f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
    amount: "5000000000",   // 50 CSPR
    status: "allowed",
    guardianReasoning: "Deposit to yield pool",
  });

  // Seed a flagged transaction for agent C (to show how alerts look)
  recordTransaction({
    hash: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    agentId: "0202b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    from: "0202b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    to: "01a07b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
    amount: "15000000000",  // 150 CSPR — flagged as unusually large
    status: "flagged",
    guardianReasoning: "Large transfer to previously unseen address. Manual review recommended.",
  });

  console.log("[Cautis] Seed data loaded: 3 agents, 6 transactions");
}
