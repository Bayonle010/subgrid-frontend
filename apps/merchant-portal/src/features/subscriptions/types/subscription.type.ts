export type SubscriptionStatus =
  | "INCOMPLETE"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type BillingInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Subscription {
  id: string;
  accountId: string;
  tenantId: string;
  customerId: string;
  planId: string;
  paymentMethodId: string;
  checkoutSessionId: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  billingInterval: BillingInterval;
  billingIntervalCount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  subscriptionsByStatus: Record<SubscriptionStatus, number>;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalRecordCount: number;
  totalPages: number;
  currentCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListSubscriptionsParams {
  status?: SubscriptionStatus;
  page?: number;
  pageSize?: number;
}

export interface SubscriptionApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata: PaginationMetadata | null;
  timestamp: string;
}

export type ListSubscriptionsResponse = SubscriptionApiResponse<Subscription[]>;
export type GetSubscriptionResponse = SubscriptionApiResponse<Subscription>;
export type GetSubscriptionAnalyticsResponse = SubscriptionApiResponse<SubscriptionAnalytics>;

export interface ManagementLinkPayload {
  subscriptionId: string;
}

export interface ManagementLinkData {
  portalSessionId: string;
  customerId: string;
  subscriptionId: string;
  portalUrl: string;
  expiresAt: string;
}

export type ManagementLinkResponse = SubscriptionApiResponse<ManagementLinkData>;

export interface PaymentRescueLinkPayload {
  invoiceId: string;
}

export interface PaymentRescueLinkData {
  portalSessionId: string;
  invoiceId: string;
  subscriptionId: string;
  rescueUrl: string;
  expiresAt: string;
}

export type PaymentRescueLinkResponse = SubscriptionApiResponse<PaymentRescueLinkData>;
