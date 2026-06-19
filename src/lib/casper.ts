// Casper Network + CSPR.cloud + x402 Integration
// Cautis — Guardian Protocol

const CSPR_CLOUD_API_KEY = process.env.CSPR_CLOUD_API_KEY || "";
const CSPR_CLOUD_BASE = "https://api.cspr.cloud";
const X402_FACILITATOR = process.env.X402_FACILITATOR_URL || "https://x402-facilitator.cspr.cloud";

// Casper Testnet RPC (public)
const CASPER_RPC = process.env.CASPER_TESTNET_RPC || "https://rpc.testnet.casper.network";
const CASPER_EVENTS = process.env.CASPER_TESTNET_EVENTS || "https://events.testnet.casper.network";

interface CsprCloudHeaders {
  Authorization: string;
  "Content-Type": string;
}

function headers(): CsprCloudHeaders {
  return {
    Authorization: `Bearer ${CSPR_CLOUD_API_KEY}`,
    "Content-Type": "application/json",
  };
}

// Account balance query via CSPR.cloud
export async function getAccountBalance(publicKey: string): Promise<{
  balance: string;
  staked: string;
}> {
  const res = await fetch(
    `${CSPR_CLOUD_BASE}/accounts/${publicKey}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`CSPR.cloud error: ${res.status}`);
  const data = await res.json();
  return {
    balance: data.balance || "0",
    staked: data.staked_balance || "0",
  };
}

// Get recent transfers for an account
export async function getRecentTransfers(
  publicKey: string,
  limit = 20
): Promise<Transfer[]> {
  const res = await fetch(
    `${CSPR_CLOUD_BASE}/accounts/${publicKey}/transfers?limit=${limit}&order=desc`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`CSPR.cloud error: ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((t: any) => ({
    hash: t.deploy_hash,
    from: t.from_public_key,
    to: t.to_public_key,
    amount: t.amount,
    timestamp: t.timestamp,
  }));
}

export interface Transfer {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

// Deploy (transaction) status
export async function getDeployStatus(deployHash: string): Promise<{
  status: string;
  error?: string;
}> {
  const res = await fetch(
    `${CSPR_CLOUD_BASE}/deploys/${deployHash}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`CSPR.cloud error: ${res.status}`);
  const data = await res.json();
  return {
    status: data.status || "unknown",
    error: data.error_message,
  };
}

// x402 Facilitator — verify a payment
export async function verifyX402Payment(payload: {
  network: string;
  from: string;
  to: string;
  amount: string;
  signature: string;
}): Promise<{ valid: boolean }> {
  const res = await fetch(`${X402_FACILITATOR}/verify`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      network: payload.network,
      payment_payload: {
        from: payload.from,
        to: payload.to,
        amount: payload.amount,
        signature: payload.signature,
      },
    }),
  });
  if (!res.ok) return { valid: false };
  const data = await res.json();
  return { valid: data.valid === true };
}

// x402 Facilitator — settle a payment on-chain
export async function settleX402Payment(payload: {
  network: string;
  from: string;
  to: string;
  amount: string;
  signature: string;
}): Promise<{ settled: boolean; deployHash?: string }> {
  const res = await fetch(`${X402_FACILITATOR}/settle`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      network: payload.network,
      payment_payload: {
        from: payload.from,
        to: payload.to,
        amount: payload.amount,
        signature: payload.signature,
      },
    }),
  });
  if (!res.ok) return { settled: false };
  const data = await res.json();
  return {
    settled: true,
    deployHash: data.deploy_hash,
  };
}

// Get supported x402 payment schemes
export async function getX402Supported(): Promise<string[]> {
  const res = await fetch(`${X402_FACILITATOR}/supported`, {
    headers: headers(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.supported || [];
}
