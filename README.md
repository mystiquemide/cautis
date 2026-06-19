# Cautis

> The Guardian Protocol for AI Agents on Casper Network

Cautis monitors AI agent transactions in real time, detects anomalies, and automatically freezes rogue activity before funds are lost. Built on Casper. Powered by x402 micropayments.

---

## How It Works

```
Agent stakes CSPR → Guardian monitors every transaction → Anomaly detected → Smart contract freeze → Funds secured
```

1. **Stake** — Agent operators stake CSPR as collateral. Sets a daily spending limit.
2. **Monitor** — Guardian AI (Claude) watches every transaction. Risk scored 0-100.
3. **Freeze** — Anomalies trigger automatic smart contract freeze. Critical alerts created.
4. **Pay** — x402 micropayments handle pay-per-check monitoring fees. No subscriptions.

---

## Architecture

```
┌──────────────────┐     REST API      ┌────────────────────────┐
│   Frontend UI    │◄─────────────────►│   Next.js API Routes    │
│   (Claude Code)  │                   │   /api/agents           │
│                  │                   │   /api/monitor          │
│   Landing Page   │                   │   /api/alerts           │
│   Dashboard      │                   │   /api/pay              │
│   Agent Detail   │                   └───────────┬────────────┘
│   Alert Center   │                               │
└──────────────────┘                   ┌───────────▼────────────┐
                                       │   Guardian Logic        │
                                       │   Claude API            │
                                       │   QuickCheck (demo)     │
                                       └───────────┬────────────┘
                                                   │
┌──────────────────────────────────────────────────▼────────────┐
│                      CASPER TESTNET                            │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ Guardian Contract│  │ x402         │  │ CSPR.cloud API    │ │
│  │ (Odra/Rust)      │  │ Facilitator  │  │ REST + Streaming  │ │
│  └─────────────────┘  └──────────────┘  └───────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + React 19 + Tailwind CSS v4 |
| Backend API | Next.js API Routes (TypeScript) |
| Guardian AI | Anthropic Claude API |
| Smart Contracts | Odra (Rust) on Casper Testnet |
| Chain Access | CSPR.cloud REST API |
| Payments | x402 Facilitator |
| Wallet | Casper Wallet / Casper Signer |

---

## Quick Start

```bash
# Clone
git clone https://github.com/mystiquemide/cautis.git
cd cautis

# Install
npm install

# Configure
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and CSPR_CLOUD_API_KEY

# Run
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for guardian analysis |
| `CSPR_CLOUD_API_KEY` | Yes | CSPR.cloud API token for x402 facilitator |
| `CASPER_TESTNET_RPC` | No | Casper Testnet RPC (default: public endpoint) |
| `X402_FACILITATOR_URL` | No | x402 facilitator URL (default: CSPR.cloud) |
| `GUARDIAN_MODE` | No | Set to `quick` for deterministic mode (no API calls) |

---

## API Reference

### Agents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/agents` | List all agents |
| `POST` | `/api/agents` | Register new agent |
| `GET` | `/api/agents/[id]` | Get agent + recent transactions |
| `PUT` | `/api/agents/[id]` | Update limits or stake |
| `POST` | `/api/agents/[id]/freeze` | Manually freeze an agent |

### Monitor

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/monitor` | Analyze a transaction (returns allow/flag/freeze) |

### Alerts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts?agentId=&resolved=` | List alerts (filterable) |
| `GET` | `/api/alerts/[id]` | Get single alert |
| `POST` | `/api/alerts/[id]` | Resolve an alert |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pay` | Get supported x402 payment schemes |
| `POST` | `/api/pay` | Verify or settle an x402 payment |

---

## Demo Flow (For Judges)

```
1. Dashboard shows 3 agents: Alpha (healthy), Beta (active), Sweeper (warning)
2. Normal transaction from Beta: ALLOWED (risk 5)

3. ATTACK SIMULATION:
   curl -X POST /api/monitor -d '{
     "agentId": "0202a1b2...d1d2e",
     "transaction": {
       "amount": "60000000000",  ← exceeds 500 CSPR daily limit
       "to": "unknown-address"
     }
   }'

4. Response: decision "freeze", risk 100
5. Agent Beta status → frozen, healthScore dropped
6. Critical alert created
7. "Cautis just blocked a $600 attack. Funds secured."
```

---

## Why Casper

- **Account Abstraction** — Agents operate with their own on-chain identity
- **x402 Micropayments** — Pay-per-check monitoring, no subscriptions
- **Predictable Fees** — Fixed gas costs for budgetable agent operations
- **Upgradable Contracts** — Guardian logic evolves without redeployment
- **MCP Native** — Direct blockchain access for AI agents

---

## Built For

Casper Agentic Buildathon 2026 — Qualification Round
Deadline: June 30, 2026 | Prize Pool: $150K

---

## License

MIT
