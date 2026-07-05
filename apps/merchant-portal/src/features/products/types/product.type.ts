export type ProductStatus = "ACTIVE" | "ARCHIVED";

export interface Product {
  id: string;
  accountId: string;
  tenantId: string;
  name: string;
  description: string;
  status: ProductStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
}

export interface ListProductsParams {
  page?: number;
  pageSize?: number;
  status?: ProductStatus;
}

export interface ListProductsMetadata {
  currentPage: number;
  pageSize: number;
  totalRecordCount: number;
  totalPages: number;
  currentCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  empty: boolean;
}

export interface ProductApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ListProductsApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Product[];
  metadata: ListProductsMetadata;
}

export type CreateProductResponse = ProductApiResponse<Product>;
