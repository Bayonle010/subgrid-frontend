import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archivePlan, createPlan, getPlanById, getProductPlans, listPlans, updatePlan } from "../services/plan.service";
import { CreatePlanPayload, Plan, UpdatePlanPayload } from "../types/plan.type";
import { useToast } from "@/shared/toast";

export const PLANS_QUERY_KEY = ["plans"];

export const useGetPlan = (id: string) => {
  return useQuery({
    queryKey: [...PLANS_QUERY_KEY, id],
    queryFn: async (): Promise<Plan> => {
      const res = await getPlanById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetProductPlans = (productId: string) => {
  return useQuery({
    queryKey: [...PLANS_QUERY_KEY, "product", productId],
    queryFn: async (): Promise<Plan[]> => {
      const res = await getProductPlans(productId);
      return res.data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useListPlans = () => {
  return useQuery({
    queryKey: PLANS_QUERY_KEY,
    queryFn: async (): Promise<Plan[]> => {
      const res = await listPlans({ page: 1, pageSize: 35, status: "ACTIVE" });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useArchivePlan = (
  id: string,
  productId: string,
  sc: () => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: () => archivePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PLANS_QUERY_KEY, "product", productId] });
      queryClient.removeQueries({ queryKey: [...PLANS_QUERY_KEY, id] });
      addToast({ variant: "success", title: "Plan archived", description: "The plan has been archived and is no longer active." });
      sc();
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to archive plan. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useUpdatePlan = (
  id: string,
  sc: (data: Plan) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => updatePlan(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [...PLANS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      addToast({ variant: "success", title: "Plan updated", description: `"${res.data.name}" has been updated.` });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to update plan. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useCreatePlan = (
  productId: string,
  sc: (data: Plan) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => createPlan(productId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PLANS_QUERY_KEY, "product", productId] });
      addToast({ variant: "success", title: "Plan created", description: `"${res.data.name}" has been added.` });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to create plan. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};
