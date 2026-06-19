# Cautis — Brand Design System

> The Guardian Protocol for AI Agents on Casper Network

---

## Brand Core

**Product:** An on-chain DeFi guardian protocol. AI agents must stake CSPR as collateral. A monitoring AI agent watches all agent transactions. Anomalies trigger a smart contract freeze. x402 micropayments pay for monitoring fees. Disputes go to on-chain arbitration.

**Positioning:** The safety net for the agent economy.

**Hook:** AI agents will manage billions on-chain. Cautis is the protocol that makes sure they don't lose it all in one bad decision.

**Personality:** Vigilant but not paranoid. Clinical but not cold. Premium but not corporate. Think "air traffic control for AI money" — calm, precise, always watching.

**Target users:** DeFi protocols integrating AI agents, agent framework developers, institutional DeFi users, hackathon judges who want to see responsible AI.

**Emotional hook:** "The first time an AI agent loses your money, you'll wish you had Cautis."

---

## Name: Cautis

- **Origin:** Latin *cautus* — "cautious, wary, guarded, prudent"
- **Pronunciation:** *KAW-tis*
- **Syllables:** 2
- **Style:** Premium, clinical, Latin-rooted
- **Validation:** Zero prior usage by any company, product, or brand (searched 24 candidates across 5 rounds)

The name IS the product: "the cautious one watches over your agents."

---

## Visual Identity

### Logo

A stylized geometric "C" formed from two interlocking shield shapes — one representing the agent, one representing the guardian. Clean geometric lines. No gradients. No glow effects. Solid and trustworthy.

**Files:**
- `assets/brand-mark.png` — Logo mark + wordmark, transparent background
- `assets/brand-mark-navy.png` — Logo mark + wordmark on navy background (#1A1A2E)

### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Background (navy) | `#1A1A2E` | Page backgrounds, hero sections |
| Surface (dark blue-gray) | `#16213E` | Cards, modals, sidebars |
| Accent (teal) | `#00D4AA` | Primary CTAs, active states, logo |
| Warning (amber) | `#F59E0B` | Alert states, anomalies detected |
| Danger (red) | `#EF4444` | Freeze triggered, critical alerts |
| Text primary | `#E2E8F0` | Body text, headings |
| Text secondary | `#94A3B8` | Subheadings, metadata |

### Typography

| Role | Font |
|---|---|
| UI / Body | **Inter** — clean, readable, modern |
| Data / Addresses | **JetBrains Mono** — monospace for addresses, hashes, amounts |

No serif fonts. This is infrastructure, not a lifestyle brand.

### Visual Motif

**Concentric rings** — like a radar sweep or a security perimeter fence. Used subtly in backgrounds, loading states, section dividers, and the hero section. Represents the "watchful eye" scanning for threats.

---

## Mascot: Cai

**Concept:** A geometric owl-like guardian figure. Owls symbolize vigilance and wisdom.

**Design:**
- **Shape:** Angular, low-poly style. Sharp triangular ears suggesting alertness.
- **Eyes:** Large circular glowing eyes that "scan" (animation potential).
- **Colors:** Teal accent (`#00D4AA`) with navy body (`#1A1A2E`).
- **Chest emblem:** A small shield.
- **Posture:** Standing guard. Watchful. Competent.
- **Tone:** Not cute, not menacing. Silent watcher. Never sleeps.

**Usage in product:**
- **Empty states:** "Cai is watching your agents."
- **Success states:** "All clear." — Cai with a subtle nod.
- **Alert states:** "Cai detected an anomaly." — Cai with glowing warning eyes.
- **Pitch deck:** Hero character on the title slide.

**Files:**
- `assets/mascot-cai.png` — Cai on transparent background
- `assets/mascot-cai-navy.png` — Cai on navy background (#1A1A2E)

---

## Product UX

### Dashboard (Main Screen)

```
┌──────────────────────────────────────────────┐
│  CAUTIS                                      │
│  ──────────────────────────────────────────  │
│  3 agents monitored · 0 alerts · 12,500 CSPR │
├──────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Agent A  │  │ Agent B  │  │ Agent C  │   │
│  │ ● Online │  │ ● Online │  │ ○ Paused │   │
│  │ 98% safe │  │ 87% safe │  │ 45% safe │   │
│  │ 5K CSPR  │  │ 5K CSPR  │  │ 2.5K     │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
│  ── Activity Feed ────────────────────────── │
│  12:03  Agent A → Swap 500 CSPR → sCSPR    │
│  12:01  Agent B → Deposit 200 CSPR → Pool  │
│  11:58  Agent A → Stake 100 CSPR           │
└──────────────────────────────────────────────┘
```

### Alert State

```
┌──────────────────────────────────────────────┐
│  ⚠ ANOMALY DETECTED                         │
│  ──────────────────────────────────────────  │
│  Agent B attempted:                          │
│  • Transfer 10,000 CSPR to unknown address   │
│  • Amount exceeds 5x daily limit             │
│  • Destination has no reputation score       │
│                                              │
│  Action taken: TRANSACTION FROZEN            │
│  Funds secured: 10,000 CSPR                  │
│                                              │
│  [Review & Release]  [Keep Frozen]           │
└──────────────────────────────────────────────┘
```

### Demo Flow (For Judges)

1. Dashboard shows 3 healthy agents being monitored
2. "Let me show you what happens during an attack..."
3. Malicious transaction injected into Agent B
4. Cautis detects anomaly — amber flash across dashboard
5. Guardian agent verifies, triggers smart contract freeze — red alert
6. Evidence logged on-chain, dispute filed
7. "Cautis just blocked a $50K rogue transaction. Funds safe."

---

## Landing Page Direction

### Section 1: Hero

- Dark navy background with concentric ring motif
- Left: Headline "Your agents need a guardian." Subhead: "Cautis monitors, detects, and freezes rogue AI transactions before funds are lost. Built on Casper. Powered by x402."
- CTAs: "Secure Your Agents" (teal fill) + "View on GitHub" (outlined)
- Right: Dashboard preview card showing agent monitoring UI
- Mascot Cai floating subtly in the corner

### Section 2: The Problem

- Stats-driven: "AI agents will manage $50B+ on-chain by 2027." "DeFi lost $1.8B to hacks in 2025 alone." "OpenZeppelin founder: AI makes all smart contracts unsafe."
- Visual: Animated timeline of major DeFi exploits

### Section 3: How Cautis Works

3-step visual flow:
1. **Stake** — Agent operators stake CSPR as collateral
2. **Monitor** — Guardian AI watches every transaction in real time
3. **Freeze** — Anomalies trigger automatic smart contract freeze

### Section 4: Why Casper

- Account Abstraction: Agents operate with their own on-chain identity
- x402 Micropayments: Agent pays per monitoring check, no subscriptions
- Predictable Fees: Fixed gas costs let agents budget
- Upgradable Contracts: Guardian logic evolves without redeployment

### Section 5: Architecture

Clean diagram showing: Agent Wallets → Cautis Guardian Contract → Casper Testnet, with x402 Facilitator for monitoring payments.

### Section 6: CTA

"Secure your agents before they need securing." + GitHub link + CSPR.fans vote link

---

## Pitch Deck Visual Direction

| Slide | Content | Visual |
|---|---|---|
| 1 | **Title** — Cautis logo + "The Guardian Protocol for AI Agents on Casper" | Logo + mascot Cai, navy background |
| 2 | **Problem** — AI agents will manage billions. No safety net exists. | Stats + recent hack headlines |
| 3 | **Solution** — Stake, Monitor, Freeze | 3-panel visual flow |
| 4 | **Architecture** — How it works on Casper | Clean diagram: Agent → Guardian → Casper |
| 5 | **Demo** — Live dashboard with attack simulation | Screenshot + alert flow |
| 6 | **Vision** — Every autonomous agent on Casper, protected | Mascot + ecosystem map |

---

## Assets Manifest

| File | Description | Format |
|---|---|---|
| `assets/brand-mark.png` | Logo mark + wordmark | PNG (RGBA) |
| `assets/brand-mark-navy.png` | Logo mark + wordmark on navy | PNG |
| `assets/mascot-cai.png` | Mascot character | PNG (RGBA) |
| `assets/mascot-cai-navy.png` | Mascot on navy background | PNG |
| `assets/landing-hero.png` | Landing page hero preview | JPEG |
| `assets/landing-hero-full.png` | Full landing page concept | JPEG |

---

## Build Rules

- No em dashes in any copy
- No generic AI gradients or floating blobs
- No crypto bro aesthetics
- Every visual choice must tie back to the product story
- Mascot must be simple enough to reuse across all surfaces
- Landing page section-by-section build via `sr71-method` skill
