export type WebhookStatus = "ACTIVE" | "DISABLED";

export type WebhookEvent =
  | "PAYMENT_FAILED"
  | "PAYMENT_SUCCEEDED"
  | "SUBSCRIPTION_ACTIVATED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_RENEWED"
  | "PLAN_CREATED"
  | "PLAN_UPDATED"
  | "PLAN_ARCHIVED"
  | "PRODUCT_CREATED"
  | "PRODUCT_ARCHIVED"
  | "CUSTOMER_CREATED";

export interface WebhookEventGroup {
  label: string;
  events: { value: WebhookEvent; label: string; description: string }[];
}

export const WEBHOOK_EVENT_GROUPS: WebhookEventGroup[] = [
  {
    label: "Payments",
    events: [
      { value: "PAYMENT_SUCCEEDED", label: "PAYMENT_SUCCEEDED", description: "A payment is processed successfully" },
      { value: "PAYMENT_FAILED", label: "PAYMENT_FAILED", description: "A payment attempt fails" },
    ],
  },
  {
    label: "Subscriptions",
    events: [
      { value: "SUBSCRIPTION_ACTIVATED", label: "SUBSCRIPTION_ACTIVATED", description: "A new subscription is activated" },
      { value: "SUBSCRIPTION_CANCELLED", label: "SUBSCRIPTION_CANCELLED", description: "A subscription is cancelled" },
      { value: "SUBSCRIPTION_RENEWED", label: "SUBSCRIPTION_RENEWED", description: "A subscription renews successfully" },
    ],
  },
  {
    label: "Plans",
    events: [
      { value: "PLAN_CREATED", label: "PLAN_CREATED", description: "A new plan is created" },
      { value: "PLAN_UPDATED", label: "PLAN_UPDATED", description: "A plan is updated" },
      { value: "PLAN_ARCHIVED", label: "PLAN_ARCHIVED", description: "A plan is archived" },
    ],
  },
  {
    label: "Products",
    events: [
      { value: "PRODUCT_CREATED", label: "PRODUCT_CREATED", description: "A new product is created" },
      { value: "PRODUCT_ARCHIVED", label: "PRODUCT_ARCHIVED", description: "A product is archived" },
    ],
  },
  {
    label: "Customers",
    events: [
      { value: "CUSTOMER_CREATED", label: "CUSTOMER_CREATED", description: "A new customer subscribes" },
    ],
  },
];

export interface Webhook {
  id: string;
  accountId: string;
  tenantId: string;
  name: string;
  url: string;
  status: WebhookStatus;
  subscribedEvents: WebhookEvent[];
  signingSecret: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookPayload {
  name: string;
  url: string;
}

export interface UpdateWebhookPayload {
  name?: string;
  url?: string;
  subscribedEvents?: WebhookEvent[];
}

export interface ListWebhooksApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Webhook[];
}

export interface WebhookApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CreateWebhookResponse = WebhookApiResponse<Webhook>;
