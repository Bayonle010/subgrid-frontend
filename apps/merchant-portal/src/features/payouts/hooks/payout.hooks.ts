import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayoutAccount, disablePayoutAccount, listBanks, listPayoutAccounts } from "../services/payout.service";
import { Bank, CreatePayoutAccountPayload, PayoutAccount } from "../types/payout.type";

export const BANKS_QUERY_KEY = ["banks"];

export const useListBanks = () => {
  return useQuery({
    queryKey: BANKS_QUERY_KEY,
    queryFn: async (): Promise<Bank[]> => {
      const res = await listBanks();
      return res.data.filter((b) => b.status === "ACTIVE");
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const PAYOUT_ACCOUNTS_QUERY_KEY = ["payout-accounts"];

export const useListPayoutAccounts = () => {
  return useQuery({
    queryKey: PAYOUT_ACCOUNTS_QUERY_KEY,
    queryFn: async (): Promise<PayoutAccount[]> => {
      const res = await listPayoutAccounts();
      return res.data;
    },
  });
};

export const useDisablePayoutAccount = (
  id: string,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => disablePayoutAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYOUT_ACCOUNTS_QUERY_KEY });
      onSuccess?.();
    },
    onError,
  });
};

export const useCreatePayoutAccount = (
  onSuccess?: (account: PayoutAccount) => void,
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) => createPayoutAccount(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: PAYOUT_ACCOUNTS_QUERY_KEY });
      onSuccess?.(res.data);
    },
    onError: () => {
      onError?.("Failed to save payout account. Please try again.");
    },
  });
};
