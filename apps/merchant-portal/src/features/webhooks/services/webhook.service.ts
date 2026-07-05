import { apiClient } from "@/lib/axios";
import {
  CreateWebhookPayload,
  CreateWebhookResponse,
  ListWebhooksApiResponse,
  UpdateWebhookPayload,
  Webhook,
  WebhookApiResponse,
} from "../types/webhook.type";

export const listWebhooks = async (): Promise<ListWebhooksApiResponse> => {
  const result = await apiClient.get("/merchant-webhook-endpoints");
  return result.data;
};

export const disableWebhook = async (id: string): Promise<void> => {
  await apiClient.patch(`/merchant-webhook-endpoints/${id}/disable`);
};

export const updateWebhook = async (
  id: string,
  payload: UpdateWebhookPayload,
): Promise<WebhookApiResponse<Webhook>> => {
  const result = await apiClient.patch(`/merchant-webhook-endpoints/${id}`, payload);
  return result.data;
};

export const createWebhook = async (
  payload: CreateWebhookPayload,
): Promise<CreateWebhookResponse> => {
  const result = await apiClient.post("/merchant-webhook-endpoints", payload);
  return result.data;
};
