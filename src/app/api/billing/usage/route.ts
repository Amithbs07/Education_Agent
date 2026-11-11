import { NextRequest, NextResponse } from "next/server";
import { getUserUsage, getUserSubscription } from "@/lib/billing/entitlements";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";

export async function GET(req: NextRequest) {
  try {
    const usage = getUserUsage();
    const sub = getUserSubscription();
    const plan = SUBSCRIPTION_PLANS[sub.planId] || SUBSCRIPTION_PLANS.free;

    return NextResponse.json({
      success: true,
      usage,
      limits: plan.limits,
      planName: plan.name,
      periodEnd: sub.currentPeriodEnd,
      percentages: {
        aiRequests: Math.min(100, Math.round((usage.aiRequestsCount / plan.limits.aiRequestsPerMonth) * 100)),
        documents: Math.min(100, Math.round((usage.documentsProcessed / plan.limits.documentUploadsPerMonth) * 100)),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load usage" }, { status: 500 });
  }
}
