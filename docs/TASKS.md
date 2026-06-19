# Cautis — Task Plan

> Sprint: June 20-30, 2026 (10 days)
> Backend only — frontend delegated to Claude Code

---

## Task Breakdown

### Phase 3: BUILD

| # | Task | File(s) | Depends | Est. |
|---|---|---|---|---|
| 1 | **Guardian logic** — Claude anomaly detection | `src/lib/guardian.ts` | — | 3h |
| 2 | **In-memory store** — Agent, Transaction, Alert storage with seed data | `src/lib/store.ts` | — | 1h |
| 3 | **Agent CRUD API** — Register, list, get, update limits, freeze | `src/app/api/agents/route.ts` + `[id]/` | 1, 2 | 2h |
| 4 | **Monitor API** — Transaction analysis endpoint (Claude decides) | `src/app/api/monitor/route.ts` | 1, 2 | 2h |
| 5 | **Alert API** — List alerts, resolve | `src/app/api/alerts/route.ts` + `[id]/` | 2, 4 | 1h |
| 6 | **x402 payment flow** — Verify + settle monitoring payments | Integration in `src/lib/casper.ts` (exists) | — | 2h |
| 7 | **Seed data** — Demo agents + transactions for judge demo | `src/lib/seed.ts` | 2 | 1h |
| 8 | **README + env setup** — .env.example, setup docs | `README.md`, `.env.example` | — | 1h |
| 9 | **Architecture diagram** — SVG for README + submission | In README | — | 1h |
| 10 | **QA + smoke tests** — Test all endpoints, verify flow | Manual + automated | All | 2h |
| 11 | **Claude frontend prompt** — Prompt for Claude to build UI | `docs/CLAUDE_PROMPT.md` | All | 1h |

### Phase 4: QA

| # | Check | Method |
|---|---|---|
| QA-1 | All API routes return correct responses | Manual curl tests |
| QA-2 | Guardian correctly flags anomalous tx | Test with sample data |
| QA-3 | Agent registration → stake → monitor → freeze flow | End-to-end test |
| QA-4 | x402 payment verification works | CSPR.cloud testnet |
| QA-5 | Environment variables loaded correctly | Runtime check |
| QA-6 | README renders on GitHub | Visual check |

### Phase 5: Prep for Claude (Frontend Handoff)

| # | Deliverable |
|---|---|
| F-1 | Complete `CLAUDE_PROMPT.md` with: brand context, API contracts, UI spec, color palette, typography, mascot, assets path |
| F-2 | All backend routes live and testable |
| F-3 | Seed data produces realistic demo scenario |

---

## Dependency Graph

```
Task 1 ──┬── Task 3 ──┬── Task 5 ──┐
Task 2 ──┤            │            │
         └── Task 4 ──┘            ├── Task 10 ── Task 11
                                   │
Task 6 ────────────────────────────┤
Task 7 ────────────────────────────┤
Task 8 ────────────────────────────┘
Task 9 ── (independent)
```

**Build order:** 1+2 in parallel → 3+4+6+7 → 5 → 8+9 → 10 → 11

---

## Demo Script (Judge Flow)

1. Dashboard shows 3 agents being monitored — "healthy", "healthy", "healthy"
2. Presenter: "Let me show you what happens when an AI agent goes rogue..."
3. Malicious transaction injected via API: Agent B attempts 50,000 CSPR transfer to unknown address
4. Monitor API returns: `{ decision: "freeze", reasoning: "..." }`
5. Dashboard updates: Agent B status → "frozen", red alert banner
6. Alert created with severity "critical"
7. Presenter: "Cautis detected the anomaly in under 3 seconds and froze the transaction. 50,000 CSPR secured."
8. Architecture walkthrough in README
