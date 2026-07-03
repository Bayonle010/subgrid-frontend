import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listApiKeys, createApiKey, revokeApiKey } from "../services/api-key.service";
import { ApiKey, CreateApiKeyPayload, CreateApiKeyResponse } from "../types/api-key.type";
import { useToast } from "@/shared/toast";

export const API_KEYS_QUERY_KEY = ["api-keys"];

export const useListApiKeys = () => {
  return useQuery({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: async (): Promise<ApiKey[]> => {
      const res = await listApiKeys();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateApiKey = (
  sc: (data: ApiKey, secretKey: string) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload): Promise<CreateApiKeyResponse> =>
      createApiKey(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      sc(res.data, res.data.secretKey ?? "");
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to create API key. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useRevokeApiKey = (
  sc: () => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      addToast({
        variant: "success",
        title: "Key revoked",
        description: "The API key has been permanently revoked.",
      });
      sc();
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to revoke key. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};
