export type SubscriptionPlanId = "free" | "pro" | "institution";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

export interface PlanLimits {
  aiRequestsPerMonth: number;
  maxLearningPaths: number;
  documentUploadsPerMonth: number;
  maxDocumentSizeMB: number;
  advancedAnalytics: boolean;
  careerGuidance: boolean;
  institutionWorkspace: boolean;
  prioritySupport: boolean;
  customGeminiModelSelection: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  limits: PlanLimits;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentProvider: "stripe" | "razorpay";
  customerId?: string;
  subscriptionId?: string;
}

export interface UsageRecord {
  userId: string;
  periodMonth: string;
  aiRequestsCount: number;
  tokensConsumed: number;
  documentsProcessed: number;
  quizzesGenerated: number;
  lastUpdated: string;
}

export interface FeatureFlag {
  id: string;
  flagName: string;
  isEnabled: boolean;
  description: string;
  rolloutPercentage: number;
}
