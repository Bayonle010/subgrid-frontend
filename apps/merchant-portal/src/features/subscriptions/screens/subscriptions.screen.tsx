"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Container, Text } from "@subgrid/ui";
import {
  CheckIcon,
  CloseIcon,
  DangerIcon,
  InactiveIcon,
  PendingIcon,
  ScrollIcon,
  SuccessIcon,
  WarningIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  useGetSubscription,
  useGetSubscriptionAnalytics,
  useListSubscriptions,
} from "../hooks/subscription.hooks";
import { Subscription, SubscriptionStatus } from "../types/subscription.type";

// ── Helpers ───────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOL: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };

const fmt = (amount: number, currency = "NGN") =>
  `${CURRENCY_SYMBOL[currency] ?? currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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

const truncId = (id: string) => `${id.slice(0, 8)}…`;

const intervalLabel = (interval: string, count: number) => {
  const map: Record<string, string> = {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    YEARLY: "year",
  };
  const unit = map[interval] ?? interval.toLowerCase();
  return count === 1 ? `Monthly` : `Every ${count} ${unit}s`;
};

// ── Status config ─────────────────────────────────────────────────────────────
type StatusConfig = { label: string; icon: React.ReactNode; className: string };

const STATUS_CONFIG: Record<SubscriptionStatus, StatusConfig> = {
  ACTIVE: {
    label: "Active",
    icon: <SuccessIcon size={11} className="text-success-text-icons" />,
    className: "bg-success-bg-light text-success-text-icons border-success-border",
  },
  TRIALING: {
    label: "Trialing",
    icon: <PendingIcon size={11} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  PAST_DUE: {
    label: "Past due",
    icon: <WarningIcon size={11} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <DangerIcon size={11} className="text-danger-text-icons" />,
    className: "bg-danger-bg-light text-danger-text-icons border-danger-border",
  },
  EXPIRED: {
    label: "Expired",
    icon: <InactiveIcon size={11} className="text-secondary" />,
    className: "bg-muted text-secondary border-border",
  },
  INCOMPLETE: {
    label: "Incomplete",
    icon: <PendingIcon size={11} className="text-secondary" />,
    className: "bg-muted text-secondary border-border",
  },
};

const StatusBadge = ({ status }: { status: SubscriptionStatus }) => {
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

// ── Analytics cards ───────────────────────────────────────────────────────────
const AnalyticsCards = () => {
  const { data: analytics, isLoading } = useGetSubscriptionAnalytics();

  const cards: {
    label: string;
    value: number;
    accent?: boolean;
    dot?: string;
    sub?: string;
  }[] = [
    {
      label: "Total",
      value: analytics?.totalSubscriptions ?? 0,
      accent: true,
    },
    {
      label: "Active",
      value: analytics?.subscriptionsByStatus.ACTIVE ?? 0,
      dot: "bg-success-bg-bold",
      sub: "Currently billing",
    },
    {
      label: "Past due",
      value: analytics?.subscriptionsByStatus.PAST_DUE ?? 0,
      dot: "bg-warning-bg-bold",
      sub: "Payment overdue",
    },
    {
      label: "Cancelled",
      value: analytics?.subscriptionsByStatus.CANCELLED ?? 0,
      dot: "bg-danger-bg-bold",
      sub: "No longer active",
    },
  ];

  return (
    <Container className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Container
          key={c.label}
          className={`rounded-2xl p-4 border flex flex-col gap-3 ${
            c.accent ? "bg-brand-bg-bold border-brand-bg-bold" : "bg-surface border-border"
          }`}
        >
          <Container className="flex items-center justify-between">
            <Text
              variant="bodyXSmall"
              className={`uppercase tracking-widest font-medium ${c.accent ? "text-white/60" : "text-secondary"}`}
            >
              {c.label}
            </Text>
            {c.dot && <Container className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />}
          </Container>
          {isLoading ? (
            <Container className={`h-7 w-12 rounded-lg animate-pulse ${c.accent ? "bg-white/20" : "bg-muted"}`} />
          ) : (
            <Text variant="h3" className={c.accent ? "text-inverted" : "text-primary"}>
              {c.value}
            </Text>
          )}
          {c.sub && (
            <Text variant="bodyXSmall" className="text-secondary">{c.sub}</Text>
          )}
        </Container>
      ))}
    </Container>
  );
};

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTER_TABS: { label: string; value: SubscriptionStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Trialing", value: "TRIALING" },
  { label: "Past due", value: "PAST_DUE" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Expired", value: "EXPIRED" },
];

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
      <Container className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </Container>
    </Container>,
    document.body,
  );
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Container className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
    <Text variant="bodyXSmall" className="text-secondary shrink-0 w-40">{label}</Text>
    <Container className="text-right">{value}</Container>
  </Container>
);

const SubscriptionDetailModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data: s, isLoading } = useGetSubscription(id);

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
        <Text variant="h5" className="text-primary font-semibold">Subscription details</Text>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <Container className="px-6 py-2 max-h-[72vh] overflow-y-auto">
        {isLoading || !s ? (
          <Container className="py-8 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Container key={i} className="flex justify-between animate-pulse">
                <Container className="h-3 w-32 rounded bg-muted" />
                <Container className="h-3 w-44 rounded bg-muted" />
              </Container>
            ))}
          </Container>
        ) : (
          <>
            <Container className="py-4 flex items-center justify-between">
              <StatusBadge status={s.status} />
              <Text variant="h4" className="text-primary font-semibold tabular-nums">
                {fmt(s.amount, s.currency)}
              </Text>
            </Container>

            <Container className="pb-2">
              <DetailRow
                label="Billing"
                value={
                  <Text variant="bodySmall" className="text-primary font-medium">
                    {intervalLabel(s.billingInterval, s.billingIntervalCount)}
                  </Text>
                }
              />
              <DetailRow
                label="Current period"
                value={
                  <Container>
                    <Text variant="bodyXSmall" className="text-primary">{fmtDate(s.currentPeriodStart)}</Text>
                    <Text variant="bodyXSmall" className="text-secondary mt-0.5">→ {fmtDate(s.currentPeriodEnd)}</Text>
                  </Container>
                }
              />
              <DetailRow
                label="Cancel at period end"
                value={
                  s.cancelAtPeriodEnd
                    ? <Container className="flex items-center gap-1.5 justify-end text-warning-text-icons"><WarningIcon size={12} /><Text variant="bodyXSmall" className="!text-[inherit]">Yes</Text></Container>
                    : <Container className="flex items-center gap-1.5 justify-end text-success-text-icons"><CheckIcon size={12} /><Text variant="bodyXSmall" className="!text-[inherit]">No</Text></Container>
                }
              />
              {s.cancelledAt && (
                <DetailRow
                  label="Cancelled at"
                  value={<Text variant="bodyXSmall" className="text-danger-text-icons">{fmtDateTime(s.cancelledAt)}</Text>}
                />
              )}
              {s.activatedAt && (
                <DetailRow
                  label="Activated"
                  value={<Text variant="bodyXSmall" className="text-secondary">{fmtDateTime(s.activatedAt)}</Text>}
                />
              )}
              <DetailRow
                label="Created"
                value={<Text variant="bodyXSmall" className="text-secondary">{fmtDateTime(s.createdAt)}</Text>}
              />
              <DetailRow
                label="Subscription ID"
                value={<Text variant="bodyXSmall" className="text-secondary font-mono break-all">{s.id}</Text>}
              />
              <DetailRow
                label="Customer ID"
                value={<Text variant="bodyXSmall" className="text-secondary font-mono break-all">{s.customerId}</Text>}
              />
              <DetailRow
                label="Plan ID"
                value={<Text variant="bodyXSmall" className="text-secondary font-mono break-all">{s.planId}</Text>}
              />
              <DetailRow
                label="Checkout session"
                value={<Text variant="bodyXSmall" className="text-secondary font-mono break-all">{s.checkoutSessionId}</Text>}
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
    {[100, 80, 80, 100, 90, 100].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <Container className="h-3 rounded-full bg-muted" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ── Subscription row ──────────────────────────────────────────────────────────
const SubscriptionRow = ({
  sub,
  onClick,
}: {
  sub: Subscription;
  onClick: () => void;
}) => (
  <tr
    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary font-mono">{truncId(sub.customerId)}</Text>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary font-mono">{truncId(sub.planId)}</Text>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">
        {fmt(sub.amount, sub.currency)}
      </Text>
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">
        {intervalLabel(sub.billingInterval, sub.billingIntervalCount)}
      </Text>
    </td>
    <td className="px-5 py-4">
      <StatusBadge status={sub.status} />
    </td>
    <td className="px-5 py-4">
      <Text variant="bodyXSmall" className="text-secondary">{fmtDate(sub.currentPeriodEnd)}</Text>
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
      <Button
        variant="neutral"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <Button
        variant="neutral"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </Container>
  </Container>
);

// ── Main screen ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

export const SubscriptionsScreen = () => {
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useListSubscriptions({
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    page,
    pageSize: PAGE_SIZE,
  });

  const subscriptions = data?.items ?? [];
  const metadata = data?.metadata ?? null;

  const handleTabChange = (tab: SubscriptionStatus | "ALL") => {
    setStatusFilter(tab);
    setPage(1);
  };

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Header */}
      <Container>
        <Text variant="h4" className="text-primary">Subscriptions</Text>
        <Text variant="bodySmall" className="text-secondary mt-0.5">
          Monitor and manage all customer subscriptions.
        </Text>
      </Container>

      {/* Analytics */}
      <AnalyticsCards />

      {/* Table card */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Filter tabs */}
        <Container className="px-5 pt-4 pb-0 border-b border-border overflow-x-auto">
          <Container className="flex items-center gap-1 min-w-max">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px cursor-pointer ${
                  statusFilter === tab.value
                    ? "border-brand-bg-bold text-brand-text-icons"
                    : "border-transparent text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </Container>
        </Container>

        {/* Table */}
        <Container className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Customer", "Plan", "Amount", "Billing", "Status", "Period ends"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    <Text
                      variant="bodyXSmall"
                      className="text-secondary uppercase tracking-wider font-medium"
                    >
                      {h}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<ScrollIcon size={22} className="text-secondary" />}
                      title="No subscriptions found"
                      description={
                        statusFilter !== "ALL"
                          ? `No ${STATUS_CONFIG[statusFilter].label.toLowerCase()} subscriptions yet.`
                          : "Subscriptions will appear here once customers sign up for your plans."
                      }
                    />
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <SubscriptionRow
                    key={sub.id}
                    sub={sub}
                    onClick={() => setSelectedId(sub.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </Container>

        {/* Pagination */}
        {metadata && metadata.totalPages > 1 && (
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
        <SubscriptionDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </Container>
  );
};
