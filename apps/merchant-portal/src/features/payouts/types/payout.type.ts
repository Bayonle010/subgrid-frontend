export interface Bank {
  id: string;
  code: string;
  name: string;
  nipCode: string | null;
  logo: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ListBanksApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Bank[];
  metadata: null;
  timestamp: string;
}

export interface LookupAccountPayload {
  accountNumber: string;
  bankCode: string;
}

export interface LookupAccountData {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

export interface LookupAccountApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LookupAccountData;
  metadata: null;
  timestamp: string;
}

export interface PayoutAccount {
  id: string;
  destinationType: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  receiverAccountId: string | null;
  status: "VERIFIED" | "PENDING" | "FAILED" | "DISABLED";
  defaultAccount: boolean;
}

export interface CreatePayoutAccountPayload {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  defaultAccount: boolean;
}

export interface PayoutAccountApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CreatePayoutAccountResponse = PayoutAccountApiResponse<PayoutAccount>;
export type ListPayoutAccountsResponse = PayoutAccountApiResponse<PayoutAccount[]>;
