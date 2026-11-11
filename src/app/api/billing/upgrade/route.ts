import { NextRequest, NextResponse } from "next/server";
import { updateUserSubscriptionPlan } from "@/lib/billing/entitlements";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  try {
    const { planId, paymentProvider = "stripe" } = await req.json();

    if (!["free", "pro", "institution"].includes(planId)) {
      return NextResponse.json({ error: "Invalid subscription plan selected." }, { status: 400 });
    }

    const updated = updateUserSubscriptionPlan(planId);
    const planDetails = SUBSCRIPTION_PLANS[planId];

    return NextResponse.json({
      success: true,
      message: `Successfully updated subscription to ${planDetails.name}.`,
      subscription: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upgrade failed" }, { status: 500 });
  }
}
