export type WithdrawalStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

export interface Withdrawal {
  id: string;
  status: WithdrawalStatus;
  destinationType: string;
  amount: number;
  currency: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  receiverAccountId: string | null;
  merchantTxRef: string;
  providerTransferId: string | null;
  providerStatus: string | null;
  failureReason: string | null;
  createdAt: string;
  succeededAt: string | null;
  failedAt: string | null;
}

export interface CreateWithdrawalPayload {
  payoutAccountId: string;
  amount: number;
  currency: string;
  narration: string;
}

export interface WithdrawalApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata: null;
  timestamp: string;
}

export type CreateWithdrawalResponse = WithdrawalApiResponse<Withdrawal>;
export type ListWithdrawalsResponse = WithdrawalApiResponse<Withdrawal[]>;
