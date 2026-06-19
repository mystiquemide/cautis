# Cautis — Product Requirements Document

> The Guardian Protocol for AI Agents on Casper Network
> Casper Agentic Buildathon 2026 — Qualification Round

---

## Elevator Pitch

Cautis is an on-chain guardian protocol that monitors AI agent transactions, detects anomalies, and freezes rogue activity before funds are lost. Built on Casper, powered by x402 micropayments for monitoring fees.

## Problem

AI agents are about to manage billions on-chain. OpenZeppelin's founder warned all smart contracts are unsafe against AI-powered exploits (May 2026). Coin Bureau's June 2026 video "The AI Exploit That Could Destroy DeFi" validated the fear. There is no safety net. One rogue agent, one bad prompt, one exploit = total loss.

**Market validation:**
- DeFi lost $1.8B to hacks in 2025
- AI-powered smart contract exploits are the #1 emerging threat
- No on-chain guardian protocol exists (enterprise solutions like Webacy/Deloitte/TrustLogix are off-chain API products, not smart contract protocols)

## Solution

Agent operators stake CSPR as collateral. A guardian AI agent (Claude) watches every transaction in real time. Anomalies trigger automatic smart contract freeze. x402 handles pay-per-check monitoring fees. Disputes go to on-chain arbitration.

## User Stories

| ID | Story | Priority |
|---|---|---|
| P1 | As a DeFi protocol, I register my AI agent and stake CSPR so it's monitored | Must |
| P1 | As a guardian, I detect anomalous transactions and freeze them automatically | Must |
| P1 | As a protocol, I see agent health scores and transaction history on a dashboard | Must |
| P2 | As a guardian, I charge x402 micropayments per monitoring check | Should |
| P2 | As a protocol, I dispute a freeze and trigger on-chain arbitration | Should |
| P3 | As a protocol, I adjust spending limits and risk thresholds per agent | Could |

## RICE Backlog

| Feature | Reach | Impact | Confidence | Effort | RICE |
|---|---|---|---|---|---|
| Agent registration + staking contract | High | High | High | M | 1 |
| Guardian anomaly detection (Claude API) | High | Critical | High | M | 2 |
| Smart contract freeze mechanism | High | Critical | Medium | L | 3 |
| Dashboard API (agent health, history) | High | High | High | S | 4 |
| x402 micropayment integration | Medium | High | Medium | M | 5 |
| Dispute + arbitration flow | Low | Medium | Low | L | 6 |

## MVP Scope (10 days)

- Agent wallet contract (stake, limits, freeze) — Odra/Rust on Casper Testnet
- Guardian agent logic (Claude API for anomaly detection)
- REST API (agent CRUD, monitoring, alerts)
- x402 payment flow for monitoring fees
- Dashboard API (health scores, transaction feed)
- README + architecture diagram

## Out of Scope

- Full dispute/arbitration DAO
- Multi-signature freeze overrides
- Agent reputation scoring system (v2)
- Cross-chain monitoring
- Mobile app

## KPIs

| Metric | Target |
|---|---|
| Anomaly detection latency | < 3 seconds |
| Freeze execution | Within 2 Casper blocks |
| Dashboard API response | < 500ms |
| Demo outcome | Successful block of malicious transaction |

## Tech Stack

| Layer | Choice |
|---|---|
| Smart Contracts | Odra (Rust) on Casper Testnet |
| Guardian AI | Anthropic Claude API |
| Backend API | Next.js 15 API routes (TypeScript) |
| Chain Access | CSPR.cloud REST API |
| Payments | x402 Facilitator |
| Frontend | Next.js + Tailwind CSS v4 (Claude Code builds) |

## Judging Criteria Alignment

| Criterion | How Cautis Answers |
|---|---|
| Technical Execution | Odra smart contracts + Claude AI + x402 + CSPR.cloud |
| Innovation & Originality | First on-chain guardian protocol for AI agents |
| Use of AI / Agentic Systems | Core Claude-powered anomaly detection agent |
| Real-World Applicability | Addresses the #1 concern about agentic DeFi |
| Working Smart Contracts | Deployed on Casper Testnet with transaction proof |
| Long-Term Launch Plans | Production-ready infrastructure play |
