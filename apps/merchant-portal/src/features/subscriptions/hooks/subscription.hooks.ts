import { useQuery } from "@tanstack/react-query";
import {
  getSubscription,
  getSubscriptionAnalytics,
  listSubscriptions,
} from "../services/subscription.service";
import {
  ListSubscriptionsParams,
  PaginationMetadata,
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
