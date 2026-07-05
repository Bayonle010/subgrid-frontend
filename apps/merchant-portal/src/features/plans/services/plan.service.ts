import { apiClient } from "@/lib/axios";
import {
  CreatePlanPayload,
  CreatePlanResponse,
  ListPlansApiResponse,
  ListPlansParams,
  Plan,
  PlanApiResponse,
  UpdatePlanPayload,
} from "../types/plan.type";

export const listPlans = async (
  params: ListPlansParams = {},
): Promise<ListPlansApiResponse> => {
  const { page = 1, pageSize = 35, status = "ACTIVE" } = params;
  const result = await apiClient.get("/plans", { params: { page, pageSize, status } });
  return result.data;
};

export const getPlanById = async (id: string): Promise<PlanApiResponse<Plan>> => {
  const result = await apiClient.get(`/plans/${id}`);
  return result.data;
};

export const getProductPlans = async (productId: string): Promise<ListPlansApiResponse> => {
  const result = await apiClient.get(`/products/${productId}/plans`);
  return result.data;
};

export const updatePlan = async (
  id: string,
  payload: UpdatePlanPayload,
): Promise<PlanApiResponse<Plan>> => {
  const result = await apiClient.patch(`/plans/${id}`, payload);
  return result.data;
};

export const archivePlan = async (id: string): Promise<void> => {
  await apiClient.patch(`/plans/${id}/archive`);
};

export const createPlan = async (
  productId: string,
  payload: CreatePlanPayload,
): Promise<CreatePlanResponse> => {
  const result = await apiClient.post(`/products/${productId}/plans`, payload);
  return result.data;
};
