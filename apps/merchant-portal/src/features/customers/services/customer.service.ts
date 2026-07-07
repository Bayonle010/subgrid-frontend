import { apiClient } from "@/lib/axios";
import {
  GetCustomerResponse,
  ListCustomersParams,
  ListCustomersResponse,
} from "../types/customer.type";

export const listCustomers = async (
  params: ListCustomersParams = {},
): Promise<ListCustomersResponse> => {
  const result = await apiClient.get("/customers", { params });
  return result.data;
};

export const getCustomer = async (id: string): Promise<GetCustomerResponse> => {
  const result = await apiClient.get(`/customers/${id}`);
  return result.data;
};
