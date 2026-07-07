"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Container, Input, Text } from "@subgrid/ui";
import {
  CloseIcon,
  DangerIcon,
  InactiveIcon,
  SuccessIcon,
  UserIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useGetCustomer, useListCustomers } from "../hooks/customer.hooks";
import { Customer, CustomerStatus } from "../types/customer.type";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const initials = (first: string, last: string) =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<CustomerStatus, { label: string; icon: React.ReactNode; className: string }> = {
  ACTIVE: {
    label: "Active",
    icon: <SuccessIcon size={11} className="text-success-text-icons" />,
    className: "bg-success-bg-light text-success-text-icons border-success-border",
  },
  INACTIVE: {
    label: "Inactive",
    icon: <InactiveIcon size={11} className="text-secondary" />,
    className: "bg-muted text-secondary border-border",
  },
};

const StatusBadge = ({ status }: { status: CustomerStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Container
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </Container>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ first, last }: { first: string; last: string }) => (
  <Container className="w-8 h-8 rounded-full bg-brand-bg-light border border-brand-border flex items-center justify-center shrink-0">
    <Text variant="bodyXSmall" className="text-brand-text-icons font-semibold text-[11px]">
      {initials(first, last)}
    </Text>
  </Container>
);

// ── Detail modal ──────────────────────────────────────────────────────────────
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <Container className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Container className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Container className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </Container>
    </Container>,
    document.body,
  );
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Container className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
    <Text variant="bodyXSmall" className="text-secondary shrink-0 w-36">{label}</Text>
    <Container className="text-right">{value}</Container>
  </Container>
);

const CustomerDetailModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data: c, isLoading } = useGetCustomer(id);

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
        <Text variant="h5" className="text-primary font-semibold">Customer details</Text>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <Container className="px-6 py-2 max-h-[70vh] overflow-y-auto">
        {isLoading || !c ? (
          <Container className="py-8 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Container key={i} className="flex justify-between animate-pulse">
                <Container className="h-3 w-28 rounded bg-muted" />
                <Container className="h-3 w-40 rounded bg-muted" />
              </Container>
            ))}
          </Container>
        ) : (
          <>
            {/* Profile header */}
            <Container className="py-5 flex items-center gap-4">
              <Container className="w-12 h-12 rounded-xl bg-brand-bg-light border border-brand-border flex items-center justify-center shrink-0">
                <Text variant="bodySmall" className="text-brand-text-icons font-bold">
                  {initials(c.firstName, c.lastName)}
                </Text>
              </Container>
              <Container>
                <Text variant="h5" className="text-primary font-semibold">
                  {c.firstName} {c.lastName}
                </Text>
                <Text variant="bodyXSmall" className="text-secondary mt-0.5">{c.email}</Text>
              </Container>
              <Container className="ml-auto">
                <StatusBadge status={c.status} />
              </Container>
            </Container>

            <Container className="pb-2">
              <DetailRow
                label="Phone"
                value={<Text variant="bodySmall" className="text-primary">{c.phone ?? "—"}</Text>}
              />
              <DetailRow
                label="External ID"
                value={
                  <Text variant="bodyXSmall" className="text-secondary font-mono">
                    {c.externalCustomerId ?? "—"}
                  </Text>
                }
              />
              <DetailRow
                label="Customer ID"
                value={<Text variant="bodyXSmall" className="text-secondary font-mono break-all">{c.id}</Text>}
              />
              <DetailRow
                label="Joined"
                value={<Text variant="bodyXSmall" className="text-secondary">{fmtDateTime(c.createdAt)}</Text>}
              />
              <DetailRow
                label="Last updated"
                value={<Text variant="bodyXSmall" className="text-secondary">{fmtDateTime(c.updatedAt)}</Text>}
              />
            </Container>
          </>
        )}
      </Container>

      <Container className="px-6 py-4 border-t border-border flex justify-end">
        <Button variant="neutral" onClick={onClose}>Close</Button>
      </Container>
    </Modal>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-border last:border-0 animate-pulse">
    <td className="px-5 py-4">
      <Container className="flex items-center gap-3">
        <Container className="w-8 h-8 rounded-full bg-muted shrink-0" />
        <Container className="flex flex-col gap-1.5">
          <Container className="h-3 w-28 rounded bg-muted" />
          <Container className="h-2.5 w-40 rounded bg-muted" />
        </Container>
      </Container>
    </td>
    {[80, 90, 80].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <Container className="h-3 rounded-full bg-muted" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ── Customer row ──────────────────────────────────────────────────────────────
const CustomerRow = ({ customer: c, onClick }: { customer: Customer; onClick: () => void }) => (
  <tr
    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <td className="px-5 py-4">
      <Container className="flex items-center gap-3">
        <Avatar first={c.firstName} last={c.lastName} />
        <Container>
          <Text variant="bodySmall" className="text-primary font-medium">
            {c.firstName} {c.lastName}
          </Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">{c.email}</Text>
        </Container>
      </Container>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">{c.phone ?? "—"}</Text>
    </td>
    <td className="px-5 py-4">
      <StatusBadge status={c.status} />
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">{fmtDate(c.createdAt)}</Text>
    </td>
  </tr>
);

// ── Pagination controls ───────────────────────────────────────────────────────
const Pagination = ({
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (p: number) => void;
}) => (
  <Container className="flex items-center justify-between px-5 py-4 border-t border-border">
    <Text variant="bodyXSmall" className="text-secondary">
      Page {page} of {totalPages}
    </Text>
    <Container className="flex items-center gap-2">
      <Button variant="neutral" disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <Button variant="neutral" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </Container>
  </Container>
);

// ── Main screen ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

const FILTER_TABS: { label: string; value: CustomerStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const CustomersScreen = () => {
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useListCustomers({
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    page,
    pageSize: PAGE_SIZE,
  });

  const allCustomers = data?.items ?? [];
  const metadata = data?.metadata ?? null;

  const filtered = useMemo(() => {
    if (!search.trim()) return allCustomers;
    const q = search.toLowerCase();
    return allCustomers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? "").includes(q),
    );
  }, [allCustomers, search]);

  const handleTabChange = (tab: CustomerStatus | "ALL") => {
    setStatusFilter(tab);
    setPage(1);
  };

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Header */}
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Customers</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            View and manage all subscribers across your plans.
          </Text>
        </Container>
        <Container className="w-full sm:w-64">
          <Input
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Container>
      </Container>

      {/* Table card */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Header + tabs */}
        <Container className="px-5 pt-4 pb-0 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <Container className="flex items-center gap-1 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.value
                    ? "border-brand-bg-bold text-brand-text-icons"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </Container>
          <Text variant="bodyXSmall" className="text-secondary pb-3 shrink-0">
            {isLoading ? "—" : `${metadata?.totalRecordCount ?? filtered.length} customer${(metadata?.totalRecordCount ?? filtered.length) !== 1 ? "s" : ""}`}
          </Text>
        </Container>

        {/* Table */}
        <Container className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Customer", "Phone", "Status", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    <Text variant="bodyXSmall" className="text-secondary uppercase tracking-wider font-medium">
                      {h}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={<UserIcon size={22} className="text-secondary" />}
                      title={search ? "No customers match your search" : "No customers yet"}
                      description={
                        search
                          ? "Try a different name, email, or phone number."
                          : "Customers will appear here once they subscribe to one of your plans."
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <CustomerRow key={c.id} customer={c} onClick={() => setSelectedId(c.id)} />
                ))
              )}
            </tbody>
          </table>
        </Container>

        {/* Pagination */}
        {metadata && metadata.totalPages > 1 && !search && (
          <Pagination
            page={metadata.currentPage}
            totalPages={metadata.totalPages}
            hasNext={metadata.hasNext}
            hasPrevious={metadata.hasPrevious}
            onPageChange={setPage}
          />
        )}
      </Container>

      {selectedId && (
        <CustomerDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </Container>
  );
};
