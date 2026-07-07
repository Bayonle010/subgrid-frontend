import { apiClient } from "@/lib/axios";
import { LedgerBalanceApiResponse } from "../types/ledger.type";

export const getLedgerBalance = async (): Promise<LedgerBalanceApiResponse> => {
  const result = await apiClient.get("/ledger/balance");
  return result.data;
};
