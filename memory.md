# Cautis — Project Memory

> Running log of decisions, gotchas, and context. Read this first when resuming work.

---

## Project Identity

- **Name:** Cautis (from Latin *cautus* — cautious, wary)
- **Tagline:** The Guardian Protocol for AI Agents on Casper
- **Hackathon:** Casper Agentic Buildathon 2026 (DoraHacks)
- **Deadline:** June 30, 2026
- **Prize Pool:** $150K USD
- **Phase:** Qualification Round (community voting + builder merit)
- **Repo:** `boilerplate-web3` (GitHub: mystiquemide/boilerplate-web3)
- **Project Dir:** `/home/ubuntu/cautis/`

---

## Architecture Decisions

| Decision | Rationale | Date |
|---|---|---|
| No database (in-memory only) | All persistent state is on-chain via Casper Testnet. Simplifies deploy. | 2026-06-20 |
| CSPR.cloud API over direct RPC | Higher level, simpler auth, already have API key. x402 facilitator handles settlement. | 2026-06-20 |
| Guardian is stateless function | Each monitoring call = fresh Claude API invocation. No persistent agent process. | 2026-06-20 |
| Odra smart contract as source of truth | Agent registration, stakes, limits, freeze status all on-chain. API reads from CSPR.cloud. | 2026-06-20 |
| x402 per-check payments | Pay-per-use monitoring. No subscriptions. Matches Casper's agent economy narrative. | 2026-06-20 |
| Stripped wagmi/viem/NextAuth/Prisma | Casper is NOT an EVM chain. wagmi/viem incompatible. Replaced with Casper-specific stack. | 2026-06-20 |
| Claude builds frontend separately | Backend (Hermes) handles API + smart contract logic. Frontend delegated to Claude Code with a prompt. | 2026-06-20 |

---

## API Keys & Access

| Service | Key Available | Notes |
|---|---|---|
| Anthropic (Claude) | ✅ | `sk-ant-api03-...` in `.env` |
| CSPR.cloud | ✅ | `019ee0fb-...` in `.env` |
| Casper Testnet RPC | ✅ | Public, no key needed |
| x402 Facilitator | ✅ | Via CSPR.cloud key |
| Casper Wallet | ❌ | Not needed for backend |

---

## Project Structure

```
cautis/
├── docs/
│   ├── PRD.md              ← Product requirements
│   ├── ARCHITECTURE.md     ← System design + data models
│   ├── DESIGN.md           ← Brand system + UX specs
│   ├── TASKS.md            ← 11 tasks + demo script
│   └── CLAUDE_PROMPT.md    ← (to be created — frontend handoff)
├── memory.md               ← This file
├── assets/                 ← Brand assets (transparent PNGs)
├── src/
│   ├── app/api/            ← Backend API routes
│   ├── lib/                ← casper.ts, guardian.ts, store.ts
│   └── components/         ← (Claude builds UI here)
├── .env                    ← API keys (gitignored)
└── .env.example            ← Template for env vars
```

---

## Gotchas & Pitfalls

1. **Casper is NOT EVM.** wagmi, viem, RainbowKit, WalletConnect EVM — all incompatible. Use CSPR.cloud REST + Casper SDK.
2. **xAI image CDN blocks downloads.** Use remove.bg URL mode for background removal. image_generate outputs JPEG only.
3. **Git commits must use MystiqueMide identity.** Set git config before any push. Never push as "Ubuntu".
4. **No em dashes in any output.** Zero tolerance. Strip before delivery.
5. **Boilerplate-web3 now includes RainbowKit.** Updated June 20. Future EVM projects get it automatically.
6. **DESIGN.md has full brand specs.** Claude prompt should reference it for colors, typography, mascot.

---

## Next Steps (Phase 3: Build)

1. Guardian logic (`src/lib/guardian.ts`)
2. In-memory store (`src/lib/store.ts`)
3. Agent CRUD API routes
4. Monitor API route
5. Alert API routes
6. x402 payment flow
7. Seed data for demo
8. README + .env.example
9. Architecture diagram
10. QA + smoke tests
11. Claude frontend prompt

---

## Session Log

| Date | What Happened |
|---|---|
| 2026-06-20 | Scout research complete — Failsafe/Cautis chosen from 5 ideas with prior art check |
| 2026-06-20 | Brand design complete — naming (24 candidates searched), logo, mascot "Cai", color system |
| 2026-06-20 | Boilerplate cloned, stripped wagmi/viem/auth/db, RainbowKit added to boilerplate-web3 repo |
| 2026-06-20 | PRD, Architecture, Tasks, Design docs created. API keys secured. |
