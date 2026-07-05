import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWebhook, disableWebhook, listWebhooks, updateWebhook } from "../services/webhook.service";
import { CreateWebhookPayload, UpdateWebhookPayload, Webhook } from "../types/webhook.type";
import { useToast } from "@/shared/toast";

export const WEBHOOKS_QUERY_KEY = ["webhooks"];

export const useListWebhooks = () => {
  return useQuery({
    queryKey: WEBHOOKS_QUERY_KEY,
    queryFn: async (): Promise<Webhook[]> => {
      const res = await listWebhooks();
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDisableWebhook = (
  id: string,
  sc: () => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: () => disableWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
      addToast({ variant: "success", title: "Endpoint disabled", description: "The webhook endpoint has been disabled." });
      sc();
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to disable webhook endpoint. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useUpdateWebhook = (
  id: string,
  sc: (data: Webhook) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateWebhookPayload) => updateWebhook(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
      addToast({ variant: "success", title: "Endpoint updated", description: "Webhook endpoint updated successfully." });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to update webhook endpoint. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useCreateWebhook = (
  sc: (data: Webhook) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateWebhookPayload) => createWebhook(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to create webhook endpoint. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};
