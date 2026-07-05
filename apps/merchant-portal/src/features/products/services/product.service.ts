import { apiClient } from "@/lib/axios";
import {
  CreateProductPayload,
  CreateProductResponse,
  ListProductsApiResponse,
  ListProductsParams,
  Product,
  ProductApiResponse,
  UpdateProductPayload,
} from "../types/product.type";

export const listProducts = async (
  params: ListProductsParams = {},
): Promise<ListProductsApiResponse> => {
  const { page = 1, pageSize = 35, status = "ACTIVE" } = params;
  const result = await apiClient.get("/products", {
    params: { page, pageSize, status },
  });
  return result.data;
};

export const getProductById = async (id: string): Promise<ProductApiResponse<Product>> => {
  const result = await apiClient.get(`/products/${id}`);
  return result.data;
};

export const archiveProduct = async (id: string): Promise<void> => {
  await apiClient.patch(`/products/${id}/archive`);
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<ProductApiResponse<Product>> => {
  const result = await apiClient.patch(`/products/${id}`, payload);
  return result.data;
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<CreateProductResponse> => {
  const result = await apiClient.post("/products", payload);
  return result.data;
};
