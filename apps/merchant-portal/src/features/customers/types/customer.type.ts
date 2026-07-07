export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface Customer {
  id: string;
  accountId: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  externalCustomerId: string | null;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListCustomersParams {
  status?: CustomerStatus;
  page?: number;
  pageSize?: number;
}

export interface CustomerPaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalRecordCount: number;
  totalPages: number;
  currentCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CustomerApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata: CustomerPaginationMetadata | null;
  timestamp: string;
}

export type ListCustomersResponse = CustomerApiResponse<Customer[]>;
export type GetCustomerResponse = CustomerApiResponse<Customer>;
