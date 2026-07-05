"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Container, Text, Button, Input, Textarea } from "@subgrid/ui";
import {
  AddIcon,
  CloseIcon,
  LegalIcon,
  ChevronRightIcon,
  ScrollIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useProductsStore } from "@/features/products/store/products.store";
import {
  useListProducts,
  useCreateProduct,
} from "@/features/products/hooks/product.hooks";
import type { Product } from "@/features/products/types/product.type";

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

// ── Skeleton card ─────────────────────────────────────────────────────────────
const ProductCardSkeleton = () => (
  <Container className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
    <Container className="flex items-start justify-between gap-3">
      <Container className="w-10 h-10 rounded-xl bg-muted" />
      <Container className="h-6 w-20 rounded-full bg-muted" />
    </Container>
    <Container className="flex-1 flex flex-col gap-2">
      <Container className="h-4 w-2/3 rounded bg-muted" />
      <Container className="h-3 w-full rounded bg-muted" />
      <Container className="h-3 w-4/5 rounded bg-muted" />
    </Container>
    <Container className="pt-2 border-t border-border flex items-center justify-between">
      <Container className="h-3 w-24 rounded bg-muted" />
      <Container className="h-3 w-16 rounded bg-muted" />
    </Container>
  </Container>
);

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({
  product,
  planCount,
  onClick,
}: {
  product: Product;
  planCount: number;
  onClick: () => void;
}) => (
  <Container className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-brand-border transition-colors">
    <Container className="flex items-start justify-between gap-3">
      <Container className="w-10 h-10 rounded-xl bg-brand-bg-light flex items-center justify-center shrink-0">
        <LegalIcon size={18} className="text-brand-text-icons" />
      </Container>
      <Container className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border">
        <ScrollIcon size={11} className="text-secondary" />
        <Text variant="bodyXSmall" className="text-secondary font-medium tabular-nums">
          {planCount} {planCount === 1 ? "plan" : "plans"}
        </Text>
      </Container>
    </Container>

    <Container className="flex-1">
      <Text variant="h5" className="text-primary font-semibold">
        {product.name}
      </Text>
      {product.description ? (
        <Text variant="bodyXSmall" className="text-secondary mt-1 line-clamp-2">
          {product.description}
        </Text>
      ) : (
        <Text variant="bodyXSmall" className="text-tertiary mt-1 italic">
          No description
        </Text>
      )}
    </Container>

    <Container className="pt-2 border-t border-border flex items-center justify-between">
      <Text variant="bodyXSmall" className="text-secondary">
        Created {new Date(product.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </Text>
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-brand-text-icons hover:underline cursor-pointer"
      >
        <Text variant="bodyXSmall" className="!text-[inherit] font-medium">View plans</Text>
        <ChevronRightIcon size={13} />
      </button>
    </Container>
  </Container>
);

// ── Create product modal ──────────────────────────────────────────────────────
const CreateProductModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (product: Product) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useCreateProduct((product) => onCreate(product));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Create product</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Products group your subscription plans together.
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
            placeholder="e.g. Cloud Storage SaaS"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="What does this product offer? (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!name.trim() || isPending}>
            {isPending ? "Creating…" : "Create product"}
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const router = useRouter();
  const { plans } = useProductsStore();
  const { data: products, isLoading } = useListProducts();
  const [showCreate, setShowCreate] = useState(false);

  const getPlanCount = (productId: string) =>
    plans.filter((p) => p.productId === productId).length;

  const handleCreate = (product: Product) => {
    setShowCreate(false);
    router.push(`/products/${product.id}`);
  };

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Products</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            Manage your products and their subscription plans.
          </Text>
        </Container>
        <Button variant="primary" leftIcon={<AddIcon size={16} />} onClick={() => setShowCreate(true)}>
          Create product
        </Button>
      </Container>

      {isLoading ? (
        <Container className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </Container>
      ) : !products?.length ? (
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <EmptyState
            icon={<LegalIcon size={22} className="text-secondary" />}
            title="No products yet"
            description="Create your first product to start building subscription plans. Products group your plans together under a single offering."
            action={{ label: "Create your first product", onClick: () => setShowCreate(true) }}
          />
        </Container>
      ) : (
        <Container className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              planCount={getPlanCount(product.id)}
              onClick={() => router.push(`/products/${product.id}`)}
            />
          ))}
        </Container>
      )}

      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </Container>
  );
}
