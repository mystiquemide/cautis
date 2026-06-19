# Claude — Build Cautis Frontend

You are building the complete frontend for Cautis, an on-chain guardian protocol for AI agents on Casper Network. This is a Next.js 16 app. The backend API is fully built and running. Your job: build the UI that sits on top of it.

---

## Brand Summary

**Product:** An AI-powered DeFi guardian. AI agents stake CSPR as collateral. A monitoring AI (Claude) watches every transaction. Anomalies trigger a smart contract freeze. x402 micropayments pay per check.

**Name:** Cautis (pronounced *KAW-tis*, from Latin *cautus* = cautious/prudent/guarded)

**Mascot:** Cai — a geometric owl. Angular, low-poly, teal accent eyes. Watcher. Never sleeps. Assets at `../../assets/mascot-cai.png` and `../../assets/mascot-cai-navy.png`.

**Tone:** Calm, precise, premium. Think "air traffic control for AI money." Not paranoid, not cold. Clinical confidence.

**Colors:**
- Background (navy): `#1A1A2E`
- Surface (dark blue-gray): `#16213E`
- Accent (teal): `#00D4AA`
- Warning (amber): `#F59E0B`
- Danger (red): `#EF4444`
- Text primary: `#E2E8F0`
- Text secondary: `#94A3B8`

**Typography:** Inter for UI/body, JetBrains Mono for addresses/hashes/amounts. No serif fonts.

**Visual Motif:** Concentric rings (radar sweep / security perimeter). Use subtly in backgrounds and loading states.

**Logo:** `../../assets/brand-mark.png` (light, transparent) and `../../assets/brand-mark-navy.png` (on navy bg).

**Key Rule:** No em dashes. No AI gradients or floating blobs. No crypto bro aesthetics. Every visual choice ties to the product story.

---

## Backend API

All endpoints are at `http://localhost:3333/api` (or same-origin if deployed together).

### Agents API

```
GET    /api/agents
  -> { agents: Agent[] }

POST   /api/agents
  <- { name, id, owner, stakeAmount?, dailyLimit? }
  -> { agent: Agent }  (status 201)

GET    /api/agents/[id]
  -> { agent: Agent, transactions: Transaction[] }

POST   /api/agents/[id]/freeze
  <- { reason }
  -> { agent: Agent, alert: Alert }
```

### Monitor API

```
POST   /api/monitor
  <- { agentId, transaction: { from, to, amount, hash } }
  -> {
       decision: "allow" | "flag" | "freeze",
       reasoning: string,
       riskScore: number (0-100),
       agentStatus: "active" | "frozen" | "paused",
       transaction: Transaction,
       alert?: Alert
     }
```

### Alerts API

```
GET    /api/alerts
  ?agentId=xxx&resolved=true|false
  -> { alerts: Alert[] }

POST   /api/alerts/[id]  (body: { resolved: true })
  -> { alert: Alert }
```

### Pay API

```
POST   /api/pay
  <- { action: "verify" | "settle", payment: { network, from, to, amount, signature } }
  -> { valid?: boolean, settled?: boolean, deployHash?: string }
```

---

## Data Models (TypeScript)

```ts
interface Agent {
  id: string            // Casper public key (long hex)
  name: string          // Human-readable label
  owner: string         // Operator public key
  stakeAmount: string   // CSPR motes
  dailyLimit: string    // CSPR motes per day
  status: "active" | "frozen" | "paused"
  healthScore: number   // 0-100
  createdAt: string     // ISO timestamp
}

interface Transaction {
  hash: string
  agentId: string
  from: string
  to: string
  amount: string        // motes
  timestamp: string
  status: "allowed" | "flagged" | "frozen"
  guardianReasoning: string
}

interface Alert {
  id: string            // UUID
  agentId: string
  transactionHash: string
  severity: "warning" | "critical"
  reason: string
  action: "flag" | "freeze"
  resolved: boolean
  createdAt: string
}
```

---

## Pages to Build

### 1. Landing Page (`/`)

The landing page already has shell components (Hero, Features, CTA) that render boilerplate content. Replace them with real Cautis content.

**Hero Section:**
- Navy background with subtle concentric ring motif (CSS, not image)
- Left side: Headline "Your agents need a guardian." Subhead: "Cautis monitors, detects, and freezes rogue AI transactions before funds are lost. Built on Casper."
- Two CTAs: "View Dashboard" (teal fill, links to `/dashboard`) + "GitHub" (outlined, links to repo)
- Right side: Mascot Cai floating (use mascot asset with a subtle floating animation)
- Stats bar below: "3 agents protected", "1,234 transactions monitored", "0 funds lost"

**Features Section:**
Three-column grid. Each card has an icon (use lucide-react: Shield, Eye, Zap):
1. **Stake** — Agent operators stake CSPR as collateral. Skin in the game.
2. **Monitor** — Guardian AI watches every transaction in real time. Never sleeps.
3. **Freeze** — Anomalies trigger automatic smart contract freeze. Funds secured.

**Why Casper Section:**
4 cards in a row:
- Account Abstraction (agents as first-class citizens)
- x402 Micropayments (pay per check, no subscriptions)
- Predictable Fees (fixed gas, agents can budget)
- Upgradable Contracts (guardian logic evolves)

**CTA Section:**
"Ready to secure your agents?" with "Launch Dashboard" button (links to `/dashboard`).

### 2. Dashboard (`/dashboard`)

This is the main product screen. It shows live agent monitoring.

**Header:**
"Cautis" logo/text on the left. Stats: "3 agents monitored · 0 alerts · 12,500 CSPR staked" on the right.

**Agent Cards (3 across):**
Each card shows:
- Agent name (top)
- Status dot (green=active, red=frozen, yellow=paused)
- Health score as a circular gauge (0-100)
- Staked CSPR amount
- Daily limit
- "View" button to see agent detail

Fetch from `GET /api/agents`.

**Activity Feed:**
Last 10 transactions across all agents. Each row: timestamp, agent name, direction (→), amount. Color-coded: green=allowed, amber=flagged, red=frozen. Clicking expands reasoning.

Build the activity feed with polling (refetch every 10 seconds) so the demo shows real-time updates.

### 3. Agent Detail (`/dashboard/[id]`)

Clicked from dashboard. Shows one agent in detail.

- Agent name, status badge, health score gauge (larger)
- Key stats: Stake amount, daily limit, total spent today
- Activity feed for this agent only (last 20 transactions)
- "Freeze Agent" button (red, with confirmation modal)
- Alerts section: all alerts for this agent

Fetch from `GET /api/agents/[id]`.

### 4. Alert Center (`/alerts`)

Shows all alerts across all agents.

- Filter tabs: All / Unresolved / Resolved
- Each alert card: severity badge (warning amber, critical red), agent name, reason, timestamp, "Resolve" button
- Resolved alerts fade out or cross out

Fetch from `GET /api/alerts`.

### 5. Monitor Simulator (`/monitor`)

For the judge demo. Lets you simulate a malicious transaction.

- Form: select agent (dropdown), enter amount, destination address
- "Simulate Transaction" button
- Result panel: shows the guardian's decision (ALLOW/FLAG/FREEZE), reasoning text, risk score bar
- If FREEZE: red pulse animation across the screen, agent status updates to frozen

Posts to `POST /api/monitor`.

---

## Existing Components

You already have these UI primitives (check their implementations):
- `src/components/ui/button.tsx` — Button component
- `src/components/ui/card.tsx` — Card component
- `src/components/ui/modal.tsx` — Modal component
- `src/components/ui/skeleton.tsx` — Loading skeleton
- `src/components/ui/toast.tsx` — Toast notifications
- `src/components/layout/nav.tsx` — Navigation bar
- `src/components/layout/footer.tsx` — Footer

The landing page has shell components at:
- `src/components/landing/hero.tsx`
- `src/components/landing/features.tsx`
- `src/components/landing/cta.tsx`

**Update** these shells with real content. Don't create parallel versions.

---

## Build Rules

1. **One page at a time.** Start with Landing, then Dashboard, then Agent Detail, then Alerts, then Monitor. Show me each page before moving to the next.

2. **Update `src/app/globals.css`** to set the dark theme:
   - Background: `#1A1A2E`
   - Text: `#E2E8F0`
   - Use the brand colors defined above
   - Replace the current light/dark CSS with our navy theme (no system preference toggle needed)

3. **Update `src/app/layout.tsx`:**
   - Title: "Cautis — Guardian Protocol for AI Agents"
   - Description: "On-chain guardian that monitors, detects, and freezes rogue AI agent transactions on Casper Network."
   - Replace Geist with Inter for sans (already installed via next/font or just use system fonts for speed)
   - Keep JetBrains Mono for monospace

4. **Match the existing code style.** The project uses:
   - Tailwind CSS v4 (no `@apply`, use utility classes directly)
   - React Server Components where possible (no "use client" unless needed for interactivity)
   - TypeScript with strict types
   - No CSS modules or styled-components

5. **Data fetching:** Use `fetch()` in server components where possible. Client components that poll should use `useEffect` + `fetch`.

6. **No em dashes** in any copy, headings, or UI text. None. Strip them all.

7. **Keep it dark.** This is a security product. Navy backgrounds, teal accents. No white backgrounds.

8. **Monospace for data.** Addresses, hashes, amounts in CSPR — use `font-mono` for all of these.

9. **Mascot usage:** Use Cai in:
   - Hero section (floating)
   - Empty states ("Cai is watching...")
   - Loading states (subtle pulse animation on Cai's eyes)

10. **The concentric ring motif:** Implement as a CSS background using `radial-gradient` or `border` with opacity. Don't overdo it — subtle, in hero and section dividers only.

---

## Demo Script (What Judges Should See)

1. Dashboard shows 3 agents — all "healthy" (green dots, high health scores)
2. Judge clicks "Monitor" → simulates a 50,000 CSPR transfer from Agent B to unknown address
3. Guardian returns: `{ decision: "freeze", reasoning: "Amount exceeds 5x daily limit", riskScore: 100 }`
4. Red pulse animation across dashboard
5. Agent B status changes to "frozen", health score drops
6. Alert created: severity "critical"
7. Activity feed shows the frozen transaction in red
8. Presenter: "Cautis detected the anomaly in under 3 seconds. 50,000 CSPR secured."

The dashboard must support this flow. The Monitor Simulator page is the "attack" trigger.

---

## Getting Started

Your working directory is `/home/ubuntu/cautis`. The dev server is at `http://localhost:3333`. The API is live and returns real data from the seed store (3 demo agents).

Start the dev server:
```bash
cd /home/ubuntu/cautis && npm run dev
```

Start with the landing page. Show me the result, then we'll move to the dashboard.
