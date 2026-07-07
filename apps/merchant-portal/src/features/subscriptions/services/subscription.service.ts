import { apiClient } from "@/lib/axios";
import {
  GetSubscriptionAnalyticsResponse,
  GetSubscriptionResponse,
  ListSubscriptionsParams,
  ListSubscriptionsResponse,
} from "../types/subscription.type";

export const listSubscriptions = async (
  params: ListSubscriptionsParams = {},
): Promise<ListSubscriptionsResponse> => {
  const result = await apiClient.get("/subscriptions", { params });
  return result.data;
};

export const getSubscription = async (id: string): Promise<GetSubscriptionResponse> => {
  const result = await apiClient.get(`/subscriptions/${id}`);
  return result.data;
};

export const getSubscriptionAnalytics = async (): Promise<GetSubscriptionAnalyticsResponse> => {
  const result = await apiClient.get("/subscriptions/analytics");
  return result.data;
};
