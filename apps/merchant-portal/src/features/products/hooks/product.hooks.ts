import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveProduct, createProduct, getProductById, listProducts, updateProduct } from "../services/product.service";
import { CreateProductPayload, Product, UpdateProductPayload } from "../types/product.type";
import { useToast } from "@/shared/toast";

export const PRODUCTS_QUERY_KEY = ["products"];

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async (): Promise<Product> => {
      const res = await getProductById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useListProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async (): Promise<Product[]> => {
      const res = await listProducts({ page: 1, pageSize: 35, status: "ACTIVE" });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useArchiveProduct = (
  id: string,
  sc: () => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: () => archiveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ["products", id] });
      addToast({ variant: "success", title: "Product archived", description: "The product has been archived and is no longer active." });
      sc();
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to archive product. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useUpdateProduct = (
  id: string,
  sc: (data: Product) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => updateProduct(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to update product. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};

export const useCreateProduct = (
  sc: (data: Product) => void,
  ec?: (err: any) => void,
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      sc(res.data);
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.message ?? "Failed to create product. Please try again.";
      addToast({ variant: "error", title: "Error", description: message });
      ec?.(e);
    },
  });
};
