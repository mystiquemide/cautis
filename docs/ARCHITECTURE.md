# Cautis — System Architecture

> Casper Agentic Buildathon 2026

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Claude Code)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Landing  │  │ Dashboard│  │ Agent    │  │ Alert       │  │
│  │ Page     │  │ Overview │  │ Detail   │  │ Center      │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (Next.js API Routes)
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND (API Layer)                        │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Agent API   │  │ Monitor API  │  │ Alert API          │ │
│  │ /api/agents │  │ /api/monitor │  │ /api/alerts        │ │
│  │ CRUD + stake│  │ tx analysis  │  │ freeze + dispute   │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────┘ │
│         │                │                    │              │
│  ┌──────▼────────────────▼────────────────────▼───────────┐ │
│  │              Guardian Agent Logic                       │ │
│  │   ┌──────────────────────────────────────────────┐     │ │
│  │   │  Claude API (Anthropic)                       │     │ │
│  │   │  Input: tx data, agent limits, history         │     │ │
│  │   │  Output: ALLOW / FLAG / FREEZE + reasoning    │     │ │
│  │   └──────────────────────────────────────────────┘     │ │
│  └────────────────────────┬───────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────▼───────────────────────────────┐ │
│  │  CSPR.cloud API Wrapper (src/lib/casper.ts)            │ │
│  │  • getAccountBalance  • getRecentTransfers             │ │
│  │  • getDeployStatus    • verifyX402Payment              │ │
│  │  • settleX402Payment  • getX402Supported               │ │
│  └────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼─────────────────────────────────┐
│                    CASPER TESTNET                             │
│                                                              │
│  ┌──────────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │ Guardian Contract │  │ x402       │  │ CSPR.cloud API   │ │
│  │ (Odra/Rust)       │  │ Facilitator│  │                  │ │
│  │                   │  │            │  │ REST + Streaming │ │
│  │ • register_agent  │  │ /verify    │  │                  │ │
│  │ • stake_cspr      │  │ /settle    │  │ api.cspr.cloud   │ │
│  │ • freeze_agent    │  │ /supported │  │                  │ │
│  │ • set_limits      │  │            │  │                  │ │
│  └──────────────────┘  └────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Data Models

```
Agent {
  id: string              // Casper public key
  name: string            // Human-readable label
  owner: string           // Operator's public key
  stake_amount: string    // CSPR staked (motes)
  daily_limit: string     // Max CSPR per day (motes)
  status: "active" | "frozen" | "paused"
  health_score: number    // 0-100
  created_at: ISO timestamp
}

Transaction {
  hash: string            // Deploy hash
  agent_id: string        // Agent public key
  from: string
  to: string
  amount: string          // In motes
  timestamp: ISO string
  status: "allowed" | "flagged" | "frozen"
  guardian_decision: string  // Claude's reasoning
}

Alert {
  id: string              // UUID
  agent_id: string        // Agent public key
  transaction_hash: string
  severity: "warning" | "critical"
  reason: string          // Human-readable explanation
  action: "flag" | "freeze"
  resolved: boolean
  created_at: ISO timestamp
}
```

## API Contracts

### Agents API — `/api/agents`

```
GET    /api/agents
  → { agents: Agent[] }

POST   /api/agents
  ← { name, public_key, daily_limit }
  → { agent: Agent }

GET    /api/agents/[id]
  → { agent: Agent, transactions: Transaction[] }

PUT    /api/agents/[id]/limits
  ← { daily_limit }
  → { agent: Agent }

POST   /api/agents/[id]/freeze
  ← { reason }
  → { agent: Agent, alert: Alert }
```

### Monitor API — `/api/monitor`

```
POST   /api/monitor
  ← { agent_id, transaction: { from, to, amount, hash } }
  → { decision: "allow" | "flag" | "freeze", reasoning: string }
```

### Alerts API — `/api/alerts`

```
GET    /api/alerts
  ?agent_id=xxx&resolved=false
  → { alerts: Alert[] }

POST   /api/alerts/[id]/resolve
  → { alert: Alert }
```

## Key Design Decisions

1. **No database** — MVP uses in-memory storage with seed data. All persistent state is on-chain via Casper Testnet. Simplifies deploy, no Railway config needed.

2. **CSPR.cloud API over direct RPC** — Higher level, simpler integration, already authenticated via API key. The x402 facilitator handles on-chain settlement.

3. **Guardian is a function, not a persistent agent** — Each monitoring call invokes Claude API with transaction context. Stateless, serverless-friendly.

4. **Odra smart contract is the source of truth** — Agent registration, stake amounts, limits, and freeze status live in the Casper Testnet contract. The API reads from CSPR.cloud.

5. **x402 payments are per-check** — Each monitoring request triggers a micropayment via the x402 facilitator. No subscription, no accounts. Pure pay-per-use.

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
CSPR_CLOUD_API_KEY=019ee0...
CASPER_TESTNET_RPC=https://rpc.testnet.casper.network
CASPER_TESTNET_EVENTS=https://events.testnet.casper.network
X402_FACILITATOR_URL=https://x402-facilitator.cspr.cloud
```

## Project Structure

```
cautis/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   └── TASKS.md
├── assets/
│   ├── brand-mark.png
│   ├── brand-mark-navy.png
│   ├── mascot-cai.png
│   └── mascot-cai-navy.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agents/     → Agent CRUD routes
│   │   │   ├── monitor/    → Transaction analysis
│   │   │   └── alerts/     → Alert management
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── casper.ts       → CSPR.cloud + x402 wrapper
│   │   ├── guardian.ts     → Claude anomaly detection
│   │   ├── store.ts        → In-memory data store
│   │   └── utils.ts
│   └── components/         → (Claude builds UI components)
├── public/
├── .env
├── package.json
└── README.md
```
