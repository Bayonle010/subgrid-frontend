import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listApiKeys, createApiKey, revokeApiKey } from "../services/api-key.service";
import { CreateApiKeyPayload } from "../types/api-key.type";
import { useToast } from "@/shared/toast";

export const API_KEYS_QUERY_KEY = ["api-keys"];

export const useListApiKeys = () => {
  return useQuery({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: listApiKeys,
  });
};

export const useCreateApiKey = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => createApiKey(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
      sc(data);
    },
    onError: (e: any) => {
      const message = e?.response?.data?.detail ?? "Failed to create API key.";
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
    mutationFn: revokeApiKey,
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
      const message = e?.response?.data?.detail ?? "Failed to revoke key.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};
