import { apiClient } from "@/lib/axios";
import {
  ApiKey,
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  RevokeApiKeyPayload,
} from "../types/api-key.type";

export const listApiKeys = async (): Promise<ApiKey[]> => {
  const result = await apiClient.get("/merchants/api-keys");
  return result.data;
};

export const createApiKey = async (
  payload: CreateApiKeyPayload,
): Promise<CreateApiKeyResponse> => {
  const result = await apiClient.post("/merchants/api-keys", payload);
  return result.data;
};

export const revokeApiKey = async (
  payload: RevokeApiKeyPayload,
): Promise<void> => {
  await apiClient.delete(`/merchants/api-keys/${payload.key_id}`);
};
