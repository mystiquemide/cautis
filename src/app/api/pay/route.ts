import { NextRequest, NextResponse } from "next/server";
import { verifyX402Payment, settleX402Payment, getX402Supported } from "@/lib/casper";

// GET /api/pay — Get supported payment schemes
export async function GET() {
  try {
    const supported = await getX402Supported();
    return NextResponse.json({
      supported,
      message: "Use POST /api/pay to verify or settle an x402 payment",
    });
  } catch (error) {
    console.error("GET /api/pay error:", error);
    return NextResponse.json(
      { error: "Failed to fetch supported payment schemes" },
      { status: 500 }
    );
  }
}

// POST /api/pay — Process an x402 payment
// Body: { action: "verify" | "settle", payment: { network, from, to, amount, signature } }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payment } = body;

    if (!action || !payment) {
      return NextResponse.json(
        { error: "Missing required fields: action, payment" },
        { status: 400 }
      );
    }

    const { network, from, to, amount, signature } = payment;
    if (!network || !from || !to || !amount || !signature) {
      return NextResponse.json(
        { error: "Payment must include: network, from, to, amount, signature" },
        { status: 400 }
      );
    }

    if (action === "verify") {
      const result = await verifyX402Payment({
        network,
        from,
        to,
        amount,
        signature,
      });

      return NextResponse.json({
        verified: result.valid,
        message: result.valid
          ? "Payment signature verified successfully"
          : "Payment verification failed",
      });
    }

    if (action === "settle") {
      const result = await settleX402Payment({
        network,
        from,
        to,
        amount,
        signature,
      });

      return NextResponse.json({
        settled: result.settled,
        deployHash: result.deployHash,
        message: result.settled
          ? `Payment settled on-chain. Deploy: ${result.deployHash?.slice(0, 12)}...`
          : "Settlement failed. Payment may not have been verified first.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'verify' or 'settle'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/pay error:", error);
    return NextResponse.json(
      { error: "Failed to process x402 payment" },
      { status: 500 }
    );
  }
}
