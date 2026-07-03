export type ApiKeyEnvironment = "live" | "test";
export type ApiKeyScope = "full_access" | "read_only" | "webhooks_only";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  environment: ApiKeyEnvironment;
  scope: ApiKeyScope;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

export interface CreateApiKeyPayload {
  name: string;
  environment: ApiKeyEnvironment;
  scope: ApiKeyScope;
}

export interface CreateApiKeyResponse {
  key: ApiKey;
  secret: string;
}

export interface RevokeApiKeyPayload {
  key_id: string;
}
