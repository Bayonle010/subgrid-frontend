export interface LedgerBalance {
  accountId: string;
  tenantId: string;
  ledgerAccountId: string;
  ledgerAccountType: string;
  availableBalance: number;
  currency: string;
  updatedAt: string;
}

export interface LedgerBalanceApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LedgerBalance;
}
