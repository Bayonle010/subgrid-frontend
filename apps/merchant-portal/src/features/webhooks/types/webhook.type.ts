export type WebhookStatus = "ACTIVE" | "DISABLED";

export type WebhookEvent =
  | "SUBSCRIPTION_ACTIVATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_CANCELLED"
  | "INVOICE_PAID"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "PAYMENT_METHOD_UPDATED";

export interface WebhookEventGroup {
  label: string;
  events: { value: WebhookEvent; label: string; description: string }[];
}

export const WEBHOOK_EVENT_GROUPS: WebhookEventGroup[] = [
  {
    label: "Subscriptions",
    events: [
      { value: "SUBSCRIPTION_ACTIVATED", label: "SUBSCRIPTION_ACTIVATED", description: "A new subscription is activated" },
      { value: "SUBSCRIPTION_UPDATED", label: "SUBSCRIPTION_UPDATED", description: "A subscription is updated" },
      { value: "SUBSCRIPTION_CANCELLED", label: "SUBSCRIPTION_CANCELLED", description: "A subscription is cancelled" },
    ],
  },
  {
    label: "Payments",
    events: [
      { value: "PAYMENT_SUCCEEDED", label: "PAYMENT_SUCCEEDED", description: "A payment is processed successfully" },
      { value: "PAYMENT_FAILED", label: "PAYMENT_FAILED", description: "A payment attempt fails" },
      { value: "PAYMENT_METHOD_UPDATED", label: "PAYMENT_METHOD_UPDATED", description: "A customer's payment method is updated" },
    ],
  },
  {
    label: "Invoices",
    events: [
      { value: "INVOICE_PAID", label: "INVOICE_PAID", description: "An invoice is marked as paid" },
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
  subscribedEvents?: WebhookEvent[];
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
