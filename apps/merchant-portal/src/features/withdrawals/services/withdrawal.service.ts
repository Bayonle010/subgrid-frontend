import { apiClient } from "@/lib/axios";
import {
  CreateWithdrawalPayload,
  CreateWithdrawalResponse,
  ListWithdrawalsResponse,
} from "../types/withdrawal.type";

export const createWithdrawal = async (
  payload: CreateWithdrawalPayload,
): Promise<CreateWithdrawalResponse> => {
  const result = await apiClient.post("/merchant-withdrawals", payload, {
    headers: {
      "Idempotency-Key": crypto.randomUUID(),
    },
  });
  return result.data;
};

export const listWithdrawals = async (): Promise<ListWithdrawalsResponse> => {
  const result = await apiClient.get("/merchant-withdrawals");
  return result.data;
};

export const getWithdrawal = async (id: string): Promise<CreateWithdrawalResponse> => {
  const result = await apiClient.get(`/merchant-withdrawals/${id}`);
  return result.data;
};

export const retryWithdrawal = async (id: string): Promise<CreateWithdrawalResponse> => {
  const result = await apiClient.post(`/merchant-withdrawals/${id}/retry`);
  return result.data;
};
