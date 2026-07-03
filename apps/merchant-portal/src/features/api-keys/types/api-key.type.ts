export type ApiKeyMode = "TEST" | "LIVE";
export type ApiKeyStatus = "ACTIVE" | "REVOKED";

export interface ApiKey {
  id: string;
  accountId: string;
  name: string;
  clientId: string;
  secretKey: string | null;
  secretPreview: string;
  mode: ApiKeyMode;
  status: ApiKeyStatus;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  name: string;
  mode: ApiKeyMode;
}

export interface ApiKeyApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CreateApiKeyResponse = ApiKeyApiResponse<ApiKey>;
export type ListApiKeysResponse = ApiKeyApiResponse<ApiKey[]>;
