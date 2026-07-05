import { create } from "zustand";

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "ANNUAL";
export type PlanCurrency = "NGN" | "USD" | "GBP";

export interface Plan {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: PlanCurrency;
  billingCycle: BillingCycle;
  trialDays: number;
  createdAt: string;
}

interface ProductsState {
  plans: Plan[];
  addPlan: (data: Omit<Plan, "id" | "createdAt">) => void;
  getPlansByProductId: (productId: string) => Plan[];
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  plans: [],

  addPlan: (data) => {
    set((s) => ({
      plans: [...s.plans, { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() }],
    }));
  },

  getPlansByProductId: (productId) =>
    get().plans.filter((p) => p.productId === productId),
}));
