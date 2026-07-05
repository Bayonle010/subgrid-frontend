export type BillingInterval = "MONTHLY" | "QUARTERLY" | "YEARLY";
export type PlanCurrency = "NGN" | "USD" | "GBP";
export type PlanStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Plan {
  id: string;
  accountId: string;
  tenantId: string;
  productId: string;
  productName: string;
  name: string;
  description: string;
  amount: number;
  currency: PlanCurrency;
  billingInterval: BillingInterval;
  billingIntervalCount: number;
  trialDays: number;
  features: string[];
  status: PlanStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  amount?: number;
  currency?: PlanCurrency;
  billingInterval?: BillingInterval;
  billingIntervalCount?: number;
  trialDays?: number;
  features?: string[];
}

export interface CreatePlanPayload {
  name: string;
  description: string;
  amount: number;
  currency: PlanCurrency;
  billingInterval: BillingInterval;
  billingIntervalCount: number;
  trialDays: number;
  features: string[];
}

export interface ListPlansParams {
  page?: number;
  pageSize?: number;
  status?: PlanStatus;
}

export interface ListPlansMetadata {
  currentPage: number;
  pageSize: number;
  totalRecordCount: number;
  totalPages: number;
  currentCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  empty: boolean;
}

export interface ListPlansApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Plan[];
  metadata: ListPlansMetadata;
}

export interface PlanApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CreatePlanResponse = PlanApiResponse<Plan>;
