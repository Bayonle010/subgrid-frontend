import { useQuery } from "@tanstack/react-query";
import { getCustomer, listCustomers } from "../services/customer.service";
import {
  Customer,
  CustomerPaginationMetadata,
  ListCustomersParams,
} from "../types/customer.type";

export const CUSTOMERS_QUERY_KEY = ["customers"];

export const useListCustomers = (params: ListCustomersParams = {}) => {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, params],
    queryFn: async (): Promise<{ items: Customer[]; metadata: CustomerPaginationMetadata | null }> => {
      const res = await listCustomers(params);
      return { items: res.data, metadata: res.metadata };
    },
    staleTime: 30_000,
  });
};

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, id],
    queryFn: async (): Promise<Customer> => {
      const res = await getCustomer(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
};
