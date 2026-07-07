import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWithdrawal, getWithdrawal, listWithdrawals, retryWithdrawal } from "../services/withdrawal.service";
import {
  CreateWithdrawalPayload,
  Withdrawal,
} from "../types/withdrawal.type";
import { LEDGER_BALANCE_QUERY_KEY } from "@/features/ledger/hooks/ledger.hooks";

export const WITHDRAWALS_QUERY_KEY = ["withdrawals"];

export const useListWithdrawals = () => {
  return useQuery({
    queryKey: WITHDRAWALS_QUERY_KEY,
    queryFn: async (): Promise<Withdrawal[]> => {
      const res = await listWithdrawals();
      return res.data;
    },
  });
};

export const useGetWithdrawal = (id: string) => {
  return useQuery({
    queryKey: [...WITHDRAWALS_QUERY_KEY, id],
    queryFn: async (): Promise<Withdrawal> => {
      const res = await getWithdrawal(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
};

export const useRetryWithdrawal = (
  id: string,
  onSuccess?: (withdrawal: Withdrawal) => void,
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => retryWithdrawal(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WITHDRAWALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...WITHDRAWALS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: LEDGER_BALANCE_QUERY_KEY });
      onSuccess?.(res.data);
    },
    onError: () => {
      onError?.("Retry failed. Please try again.");
    },
  });
};

export const useCreateWithdrawal = (
  onSuccess?: (withdrawal: Withdrawal) => void,
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWithdrawalPayload) => createWithdrawal(payload),
    onSuccess: (res) => {
      // Refresh withdrawals list and balance after a successful withdrawal
      queryClient.invalidateQueries({ queryKey: WITHDRAWALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEDGER_BALANCE_QUERY_KEY });
      onSuccess?.(res.data);
    },
    onError: () => {
      onError?.("Failed to process withdrawal. Please try again.");
    },
  });
};
