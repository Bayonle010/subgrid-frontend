import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createManagementLink,
  createPaymentRescueLink,
  getSubscription,
  getSubscriptionAnalytics,
  listSubscriptions,
} from "../services/subscription.service";
import {
  ListSubscriptionsParams,
  ManagementLinkData,
  PaginationMetadata,
  PaymentRescueLinkData,
  Subscription,
  SubscriptionAnalytics,
} from "../types/subscription.type";

export const SUBSCRIPTIONS_QUERY_KEY = ["subscriptions"];
export const SUBSCRIPTION_ANALYTICS_QUERY_KEY = ["subscriptions", "analytics"];

export const useListSubscriptions = (params: ListSubscriptionsParams = {}) => {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, params],
    queryFn: async (): Promise<{ items: Subscription[]; metadata: PaginationMetadata | null }> => {
      const res = await listSubscriptions(params);
      return { items: res.data, metadata: res.metadata };
    },
    staleTime: 30_000,
  });
};

export const useGetSubscription = (id: string) => {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, id],
    queryFn: async (): Promise<Subscription> => {
      const res = await getSubscription(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
};

// Hardcoded until per-subscription invoiceId is available from the API
const RESCUE_INVOICE_ID = "d6ca24df-de79-47da-8671-818f1cb4db6e";

export const useCreatePaymentRescueLink = (
  onSuccess?: (data: PaymentRescueLinkData) => void,
  onError?: (message: string) => void,
) => {
  return useMutation({
    mutationFn: () => createPaymentRescueLink({ invoiceId: RESCUE_INVOICE_ID }),
    onSuccess: (res) => onSuccess?.(res.data),
    onError: () => onError?.("Failed to generate rescue link. Please try again."),
  });
};

export const useCreateManagementLink = (
  subscriptionId: string,
  onSuccess?: (data: ManagementLinkData) => void,
  onError?: (message: string) => void,
) => {
  return useMutation({
    mutationFn: () => createManagementLink({ subscriptionId }),
    onSuccess: (res) => onSuccess?.(res.data),
    onError: () => onError?.("Failed to generate management link. Please try again."),
  });
};

export const useGetSubscriptionAnalytics = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_ANALYTICS_QUERY_KEY,
    queryFn: async (): Promise<SubscriptionAnalytics> => {
      const res = await getSubscriptionAnalytics();
      return res.data;
    },
    staleTime: 60_000,
  });
};
