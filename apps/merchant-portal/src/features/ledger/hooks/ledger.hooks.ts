import { useQuery } from "@tanstack/react-query";
import { getLedgerBalance } from "../services/ledger.service";
import { LedgerBalance } from "../types/ledger.type";

export const LEDGER_BALANCE_QUERY_KEY = ["ledger", "balance"];

export const useGetLedgerBalance = () => {
  return useQuery({
    queryKey: LEDGER_BALANCE_QUERY_KEY,
    queryFn: async (): Promise<LedgerBalance> => {
      const res = await getLedgerBalance();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};
