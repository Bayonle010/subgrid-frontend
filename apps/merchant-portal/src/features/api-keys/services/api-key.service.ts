import { apiClient } from "@/lib/axios";
import {
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  ListApiKeysResponse,
} from "../types/api-key.type";

export const listApiKeys = async (): Promise<ListApiKeysResponse> => {
  const result = await apiClient.get("/api-keys");
  return result.data;
};

export const createApiKey = async (
  payload: CreateApiKeyPayload,
): Promise<CreateApiKeyResponse> => {
  const result = await apiClient.post("/api-keys", payload);
  return result.data;
};

export const revokeApiKey = async (id: string): Promise<void> => {
  await apiClient.post(`/api-keys/${id}/revoke`);
};
