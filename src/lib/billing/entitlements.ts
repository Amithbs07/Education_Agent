import { SUBSCRIPTION_PLANS } from "./plans";
import { MOCK_USER_SUBSCRIPTION, MOCK_USAGE_RECORD } from "./mock-billing-store";
import { PlanLimits } from "@/types/billing";

let currentUsage = { ...MOCK_USAGE_RECORD };
let currentSub = { ...MOCK_USER_SUBSCRIPTION };

export function getUserSubscription(userId: string = "user_citadel_01") {
  return currentSub;
}

export function getUserUsage(userId: string = "user_citadel_01") {
  return currentUsage;
}

export function updateUserSubscriptionPlan(newPlanId: "free" | "pro" | "institution") {
  currentSub = {
    ...currentSub,
    planId: newPlanId,
    status: "active",
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  };
  return currentSub;
}

export function checkAIQueryEntitlement(userId: string = "user_citadel_01"): {
  allowed: boolean;
  current: number;
  limit: number;
  planId: string;
  reason?: string;
} {
  const plan = SUBSCRIPTION_PLANS[currentSub.planId] || SUBSCRIPTION_PLANS.free;
  const limit = plan.limits.aiRequestsPerMonth;
  const current = currentUsage.aiRequestsCount;

  if (current >= limit) {
    return {
      allowed: false,
      current,
      limit,
      planId: plan.id,
      reason: `Monthly AI query quota of ${limit} requests reached for ${plan.name}. Please upgrade to Student Pro for higher limits.`,
    };
  }

  // Increment usage
  currentUsage.aiRequestsCount += 1;
  currentUsage.lastUpdated = new Date().toISOString();

  return {
    allowed: true,
    current: currentUsage.aiRequestsCount,
    limit,
    planId: plan.id,
  };
}

export function checkDocumentUploadEntitlement(
  fileSizeMB: number,
  userId: string = "user_citadel_01"
): { allowed: boolean; reason?: string } {
  const plan = SUBSCRIPTION_PLANS[currentSub.planId] || SUBSCRIPTION_PLANS.free;

  if (fileSizeMB > plan.limits.maxDocumentSizeMB) {
    return {
      allowed: false,
      reason: `File size (${fileSizeMB.toFixed(1)}MB) exceeds your plan's maximum allowed limit of ${plan.limits.maxDocumentSizeMB}MB.`,
    };
  }

  if (currentUsage.documentsProcessed >= plan.limits.documentUploadsPerMonth) {
    return {
      allowed: false,
      reason: `You have reached your monthly document upload limit of ${plan.limits.documentUploadsPerMonth} files.`,
    };
  }

  // Record document upload
  currentUsage.documentsProcessed += 1;
  return { allowed: true };
}

export function checkFeatureEntitlement(
  feature: keyof PlanLimits,
  userId: string = "user_citadel_01"
): boolean {
  const plan = SUBSCRIPTION_PLANS[currentSub.planId] || SUBSCRIPTION_PLANS.free;
  return Boolean(plan.limits[feature]);
}
