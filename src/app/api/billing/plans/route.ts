import { NextRequest, NextResponse } from "next/server";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";
import { getUserSubscription, getUserUsage } from "@/lib/billing/entitlements";

export async function GET(req: NextRequest) {
  try {
    const subscription = getUserSubscription();
    const usage = getUserUsage();

    return NextResponse.json({
      success: true,
      plans: Object.values(SUBSCRIPTION_PLANS),
      currentSubscription: subscription,
      currentUsage: usage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load plans" }, { status: 500 });
  }
}
