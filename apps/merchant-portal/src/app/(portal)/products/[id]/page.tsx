"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { Container, Text, Button, Input, Textarea, Select } from "@subgrid/ui";
import {
  AddIcon,
  BackIcon,
  CloseIcon,
  LegalIcon,
  ScrollIcon,
  ThemeIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useCreatePlan, useGetProductPlans } from "@/features/plans/hooks/plan.hooks";
import type {
  Plan,
  BillingInterval,
  PlanCurrency,
} from "@/features/plans/types/plan.type";
import {
  useArchiveProduct,
  useGetProduct,
  useUpdateProduct,
} from "@/features/products/hooks/product.hooks";
import type { Product } from "@/features/products/types/product.type";

// ── Helpers ───────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOL: Record<PlanCurrency, string> = { NGN: "₦", USD: "$", GBP: "£" };
const INTERVAL_LABEL: Record<BillingInterval, string> = { MONTHLY: "Monthly", QUARTERLY: "Quarterly", YEARLY: "Yearly" };
const INTERVAL_SUFFIX: Record<BillingInterval, string> = { MONTHLY: "/ mo", QUARTERLY: "/ qtr", YEARLY: "/ yr" };

const formatAmount = (amount: number, currency: PlanCurrency, interval: BillingInterval) =>
  `${CURRENCY_SYMBOL[currency]}${amount.toLocaleString()} ${INTERVAL_SUFFIX[interval]}`;

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <Container className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Container className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Container className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </Container>
    </Container>,
    document.body,
  );
};

// ── Edit product modal ────────────────────────────────────────────────────────
const EditProductModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);

  const { mutate, isPending } = useUpdateProduct(product.id, () => onClose());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name: name.trim(), description: description.trim() });
  };

  const hasChanges = name.trim() !== product.name || description.trim() !== product.description;

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Edit product</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Update the product name or description.
          </Text>
        </Container>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer"
        >
          <CloseIcon size={16} />
        </button>
      </Container>

      <form onSubmit={handleSubmit}>
        <Container className="px-6 py-5 flex flex-col gap-4">
          <Input
            label="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!name.trim() || !hasChanges || isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Add plan modal ────────────────────────────────────────────────────────────
const AddPlanModal = ({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<PlanCurrency>("NGN");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("MONTHLY");
  const [billingIntervalCount, setBillingIntervalCount] = useState("1");
  const [trialDays, setTrialDays] = useState("");
  const [featuresText, setFeaturesText] = useState("");

  const { mutate, isPending } = useCreatePlan(productId, () => onClose());

  const isValid = name.trim() && amount && Number(amount) >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    mutate({
      name: name.trim(),
      description: description.trim(),
      amount: Number(amount),
      currency,
      billingInterval,
      billingIntervalCount: Number(billingIntervalCount) || 1,
      trialDays: Number(trialDays) || 0,
      features,
    });
  };

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Add plan</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Define pricing and billing terms for this product.
          </Text>
        </Container>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer"
        >
          <CloseIcon size={16} />
        </button>
      </Container>

      <form onSubmit={handleSubmit}>
        <Container className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <Input
            label="Plan name"
            placeholder="e.g. Starter, Growth, Enterprise"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="What's included in this plan? (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <Container className="grid grid-cols-2 gap-3">
            <Input
              label="Amount"
              placeholder="0"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(v) => setCurrency(v as PlanCurrency)}
              options={[
                { value: "NGN", label: "NGN — ₦" },
                { value: "USD", label: "USD — $" },
                { value: "GBP", label: "GBP — £" },
              ]}
            />
          </Container>
          <Container className="grid grid-cols-2 gap-3">
            <Select
              label="Billing interval"
              value={billingInterval}
              onChange={(v) => setBillingInterval(v as BillingInterval)}
              options={[
                { value: "MONTHLY", label: "Monthly" },
                { value: "QUARTERLY", label: "Quarterly" },
                { value: "YEARLY", label: "Yearly" },
              ]}
            />
            <Input
              label="Every (count)"
              placeholder="1"
              type="number"
              min="1"
              value={billingIntervalCount}
              onChange={(e) => setBillingIntervalCount(e.target.value)}
            />
          </Container>
          <Input
            label="Trial period (days)"
            placeholder="0 — no trial"
            type="number"
            min="0"
            value={trialDays}
            onChange={(e) => setTrialDays(e.target.value)}
          />
          <Textarea
            label="Features (one per line)"
            placeholder={"Priority support\nUnlimited access\nCertificate of completion"}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={3}
          />
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!isValid || isPending}>
            {isPending ? "Adding…" : "Add plan"}
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Plan row ──────────────────────────────────────────────────────────────────
const PlanRow = ({ plan }: { plan: Plan }) => (
  <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
    <td className="px-5 py-4">
      <Container className="flex items-center gap-3">
        <Container className="w-8 h-8 rounded-lg bg-brand-bg-light flex items-center justify-center shrink-0">
          <LegalIcon size={14} className="text-brand-text-icons" />
        </Container>
        <Container>
          <Text variant="bodySmall" className="text-primary font-medium">{plan.name}</Text>
          {plan.description && (
            <Text variant="bodyXSmall" className="text-secondary truncate max-w-[200px]">{plan.description}</Text>
          )}
        </Container>
      </Container>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">
        {formatAmount(plan.amount, plan.currency, plan.billingInterval)}
      </Text>
    </td>
    <td className="px-5 py-4">
      <Container className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted border border-border">
        <Text variant="bodyXSmall" className="text-secondary font-medium">
          {INTERVAL_LABEL[plan.billingInterval]}
        </Text>
      </Container>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">
        {plan.trialDays > 0 ? `${plan.trialDays} days` : "—"}
      </Text>
    </td>
    <td className="px-5 py-4">
      <Container className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-bg-light border border-success-border">
        <Container className="w-1.5 h-1.5 rounded-full bg-success-bg-bold" />
        <Text variant="bodyXSmall" className="text-success-text-icons font-medium">Active</Text>
      </Container>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">
        {new Date(plan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </Text>
    </td>
  </tr>
);

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useGetProduct(id);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const { mutate: archive, isPending: archiving } = useArchiveProduct(id, () =>
    router.push("/products"),
  );

  const { data: plans = [] } = useGetProductPlans(id);

  if (isLoading) {
    return (
      <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        <Container className="flex flex-col gap-4">
          <Container className="h-4 w-20 rounded bg-muted animate-pulse" />
          <Container className="flex items-center gap-4">
            <Container className="w-12 h-12 rounded-2xl bg-muted animate-pulse shrink-0" />
            <Container className="flex flex-col gap-2">
              <Container className="h-5 w-48 rounded bg-muted animate-pulse" />
              <Container className="h-3 w-64 rounded bg-muted animate-pulse" />
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <EmptyState
          icon={<LegalIcon size={22} className="text-secondary" />}
          title="Product not found"
          description="This product doesn't exist or may have been deleted."
          action={{ label: "Back to products", onClick: () => router.push("/products") }}
        />
      </Container>
    );
  }

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      {/* Header */}
      <Container className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors w-fit cursor-pointer"
        >
          <BackIcon size={16} />
          <Text variant="bodySmall" className="!text-[inherit] font-medium">Products</Text>
        </button>

        <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <Container className="flex items-center gap-4">
            <Container className="w-12 h-12 rounded-2xl bg-brand-bg-light flex items-center justify-center shrink-0">
              <LegalIcon size={20} className="text-brand-text-icons" />
            </Container>
            <Container>
              <Text variant="h4" className="text-primary">{product.name}</Text>
              <Text variant="bodySmall" className="text-secondary mt-0.5">
                {product.description || "No description provided"}
              </Text>
            </Container>
          </Container>

          <Container className="flex items-center gap-2 shrink-0 flex-wrap">
            <Container className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
              <ScrollIcon size={12} className="text-secondary" />
              <Text variant="bodyXSmall" className="text-secondary font-medium tabular-nums">
                {plans.length} {plans.length === 1 ? "plan" : "plans"}
              </Text>
            </Container>

            {confirmArchive ? (
              <Container className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-danger-bg-light border border-danger-border">
                <Text variant="bodyXSmall" className="text-danger-text-icons font-medium">
                  Archive this product?
                </Text>
                <button
                  onClick={() => archive()}
                  disabled={archiving}
                  className="text-danger-text-icons font-semibold text-xs hover:underline cursor-pointer disabled:opacity-50"
                >
                  {archiving ? "Archiving…" : "Confirm"}
                </button>
                <button
                  onClick={() => setConfirmArchive(false)}
                  className="text-secondary hover:text-primary text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </Container>
            ) : (
              <Button variant="danger" size="small" onClick={() => setConfirmArchive(true)}>
                Archive
              </Button>
            )}

            <Button
              variant="secondary"
              leftIcon={<ThemeIcon size={15} />}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </Button>
            <Button variant="primary" leftIcon={<AddIcon size={16} />} onClick={() => setShowAddPlan(true)}>
              Add plan
            </Button>
          </Container>
        </Container>
      </Container>

      {/* Plans table */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-5 sm:px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">Plans</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Subscription tiers attached to this product
          </Text>
        </Container>

        <Container className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Plan", "Price", "Billing cycle", "Trial period", "Status", "Created"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    <Text variant="bodyXSmall" className="text-secondary uppercase tracking-wider font-medium">
                      {h}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <PlanRow key={plan.id} plan={plan} />
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<LegalIcon size={22} className="text-secondary" />}
                      title="No plans yet"
                      description="Add your first plan to define how customers will subscribe to this product. Set a price, billing cycle, and optional trial period."
                      action={{ label: "Add first plan", onClick: () => setShowAddPlan(true) }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Container>
      </Container>

      {showEdit && (
        <EditProductModal
          product={product}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showAddPlan && (
        <AddPlanModal
          productId={id}
          onClose={() => setShowAddPlan(false)}
        />
      )}
    </Container>
  );
}
