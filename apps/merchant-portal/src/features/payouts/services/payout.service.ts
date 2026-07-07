import { apiClient } from "@/lib/axios";
import {
  CreatePayoutAccountPayload,
  CreatePayoutAccountResponse,
  ListBanksApiResponse,
  ListPayoutAccountsResponse,
  LookupAccountApiResponse,
  LookupAccountPayload,
} from "../types/payout.type";

export const listBanks = async (): Promise<ListBanksApiResponse> => {
  const result = await apiClient.get("/banks");
  return result.data;
};

export const lookupBankAccount = async (
  payload: LookupAccountPayload,
): Promise<LookupAccountApiResponse> => {
  const result = await apiClient.post("/payout-accounts/lookup", payload);
  return result.data;
};

export const listPayoutAccounts = async (): Promise<ListPayoutAccountsResponse> => {
  const result = await apiClient.get("/payout-accounts");
  return result.data;
};

export const disablePayoutAccount = async (id: string): Promise<void> => {
  await apiClient.patch(`/payout-accounts/${id}/disable`);
};

export const createPayoutAccount = async (
  payload: CreatePayoutAccountPayload,
): Promise<CreatePayoutAccountResponse> => {
  const result = await apiClient.post("/payout-accounts", payload);
  return result.data;
};
