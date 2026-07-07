"use client";
import React from "react";
import { Container, Text, Button } from "@subgrid/ui";
import {
  WalletIcon,
  UserIcon,
  LegalIcon,
  SuccessIcon,
  WarningIcon,
  DangerIcon,
  PendingIcon,
  ScrollIcon,
  AddIcon,
  ChevronRightIcon,
} from "@subgrid/ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/shared/ui/empty-state";
import { useListApiKeys } from "@/features/api-keys/hooks/api-key.hooks";
import { useGetLedgerBalance } from "@/features/ledger/hooks/ledger.hooks";
import { useListCustomers } from "@/features/customers/hooks/customer.hooks";
import { useGetSubscriptionAnalytics, useListSubscriptions } from "@/features/subscriptions/hooks/subscription.hooks";
import { WithdrawModal } from "@/features/withdrawals/screens/withdrawals.screen";

type SubStatus = "ACTIVE" | "TRIALING" | "CANCELLED" | "PAST_DUE" | "INCOMPLETE" | "EXPIRED";

const STATUS_CONFIG: Record<SubStatus, { label: string; icon: React.ReactNode; className: string }> = {
  ACTIVE: {
    label: "Active",
    icon: <SuccessIcon size={12} className="text-success-text-icons" />,
    className: "bg-success-bg-light text-success-text-icons border-success-border",
  },
  TRIALING: {
    label: "Trialing",
    icon: <PendingIcon size={12} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <DangerIcon size={12} className="text-danger-text-icons" />,
    className: "bg-danger-bg-light text-danger-text-icons border-danger-border",
  },
  PAST_DUE: {
    label: "Past due",
    icon: <WarningIcon size={12} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  INCOMPLETE: {
    label: "Incomplete",
    icon: <PendingIcon size={12} className="text-secondary" />,
    className: "bg-muted text-secondary border-border",
  },
  EXPIRED: {
    label: "Expired",
    icon: <WarningIcon size={12} className="text-secondary" />,
    className: "bg-muted text-secondary border-border",
  },
};

const StatCard = ({
  label,
  value,
  sub,
  icon,
  accent = false,
  loading = false,
  action,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
  loading?: boolean;
  action?: { label: string; onClick: () => void };
}) => (
  <Container
    className={`rounded-2xl p-5 border flex flex-col gap-4 ${
      accent ? "bg-brand-bg-bold border-brand-bg-bold" : "bg-surface border-border"
    }`}
  >
    <Container className="flex items-center justify-between">
      <Text variant="bodyXSmall" className={`uppercase tracking-widest font-medium ${accent ? "text-white/60" : "text-secondary"}`}>
        {label}
      </Text>
      <Container className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-white/12" : "bg-muted"}`}>
        {icon}
      </Container>
    </Container>
    <Container className="flex items-end justify-between gap-2">
      <Container>
        {loading ? (
          <Container className={`h-8 w-36 rounded-lg animate-pulse ${accent ? "bg-white/20" : "bg-muted"}`} />
        ) : (
          <Text variant="h3" className={accent ? "text-inverted" : "text-primary"}>
            {value}
          </Text>
        )}
        <Text variant="bodyXSmall" className={accent ? "text-white/50 mt-0.5" : "text-secondary mt-0.5"}>
          {sub}
        </Text>
      </Container>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </Container>
  </Container>
);

const StatusBadge = ({ status }: { status: SubStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Container className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </Container>
  );
};

const KeySkeleton = () => (
  <Container className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
    <Container className="flex items-center gap-2.5">
      <Container className="w-2 h-2 rounded-full bg-muted shrink-0" />
      <Container className="h-3 w-28 rounded bg-muted" />
    </Container>
    <Container className="flex items-center gap-2">
      <Container className="h-4 w-10 rounded-full bg-muted" />
      <Container className="h-3 w-12 rounded bg-muted" />
    </Container>
  </Container>
);

export default function DashboardPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const router = useRouter();

  const { data: apiKeys, isLoading: keysLoading } = useListApiKeys();
  const { data: balance, isLoading: balanceLoading } = useGetLedgerBalance();
  const { data: analytics } = useGetSubscriptionAnalytics();
  const { data: recentSubsData, isLoading: subsLoading } = useListSubscriptions({ page: 1, pageSize: 5 });
  const { data: customersData } = useListCustomers({ page: 1, pageSize: 1 });
  const recentSubs = recentSubsData?.items ?? [];

  const CURRENCY_SYMBOL: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };
  const formattedBalance = balance
    ? `${CURRENCY_SYMBOL[balance.currency] ?? balance.currency}${balance.availableBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";
  const balanceUpdated = balance
    ? `Updated ${new Date(balance.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
    : "No data yet";

  const activeKeys = apiKeys?.filter((k) => k.status === "ACTIVE") ?? [];
  const revokedKeys = apiKeys?.filter((k) => k.status === "REVOKED") ?? [];
  const recentKeys = [...(apiKeys ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container>
        <Text variant="h4" className="text-primary">
          Dashboard
        </Text>
        <Text variant="bodySmall" className="text-secondary mt-0.5">
          Overview of your subscription business
        </Text>
      </Container>

      <Container className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Container className="flex flex-col gap-1">
          <StatCard
            label="Available Balance"
            value={formattedBalance}
            sub={balanceUpdated}
            icon={<WalletIcon size={16} className="text-white" />}
            accent
            loading={balanceLoading}
            action={{ label: "Withdraw", onClick: () => setShowWithdraw(true) }}
          />
          <button
            onClick={() => router.push("/withdrawals")}
            className="flex items-center gap-1 self-end pr-1 text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <Text variant="bodyXSmall" className="!text-[inherit] text-[11px]">Withdrawal history</Text>
            <ChevronRightIcon size={11} />
          </button>
        </Container>
        <StatCard
          label="Active Subscriptions"
          value={analytics ? String(analytics.subscriptionsByStatus.ACTIVE) : "—"}
          sub={analytics ? `${analytics.totalSubscriptions} total` : "Loading…"}
          icon={<ScrollIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Past Due"
          value={analytics ? String(analytics.subscriptionsByStatus.PAST_DUE) : "—"}
          sub={analytics ? `${analytics.subscriptionsByStatus.CANCELLED} cancelled` : "Loading…"}
          icon={<WarningIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Total Customers"
          value={customersData?.metadata ? String(customersData.metadata.totalRecordCount) : "—"}
          sub={customersData?.metadata ? "Registered customers" : "Loading…"}
          icon={<UserIcon size={16} className="text-secondary" />}
        />
      </Container>

      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}

      <Container className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Subscriptions table */}
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Container className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
            <Text variant="h5" className="text-primary font-semibold">
              Recent subscriptions
            </Text>
            <button
              onClick={() => router.push("/subscriptions")}
              className="flex items-center gap-1 text-brand-text-icons hover:underline cursor-pointer"
            >
              <Text variant="bodyXSmall" className="!text-[inherit] font-medium">View all</Text>
              <ChevronRightIcon size={13} />
            </button>
          </Container>

          <Container className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Customer", "Amount", "Billing", "Status", "Period ends"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left">
                      <Text variant="bodyXSmall" className="text-secondary uppercase tracking-wider font-medium">
                        {h}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0 animate-pulse">
                      {[120, 80, 90, 80, 90].map((w, j) => (
                        <td key={j} className="px-5 py-4">
                          <Container className="h-3 rounded-full bg-muted" style={{ width: w }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentSubs.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        icon={<ScrollIcon size={22} className="text-secondary" />}
                        title="No subscriptions yet"
                        description="They'll appear here once customers subscribe to your plans."
                      />
                    </td>
                  </tr>
                ) : (
                  recentSubs.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push("/subscriptions")}
                    >
                      <td className="px-5 py-4">
                        <Text variant="bodyXSmall" className="text-secondary font-mono">
                          {sub.customerId.slice(0, 8)}…
                        </Text>
                      </td>
                      <td className="px-5 py-4">
                        <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">
                          {`${sub.currency === "NGN" ? "₦" : sub.currency}${sub.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </Text>
                      </td>
                      <td className="px-5 py-4">
                        <Text variant="bodyXSmall" className="text-secondary capitalize">
                          {sub.billingInterval.charAt(0) + sub.billingInterval.slice(1).toLowerCase()}
                        </Text>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status as SubStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <Text variant="bodyXSmall" className="text-secondary">
                          {new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </Text>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Container>
        </Container>

        {/* API Keys sidebar */}
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <Container className="px-5 py-4 border-b border-border flex items-center justify-between">
            <Container>
              <Text variant="h5" className="text-primary font-semibold">API Keys</Text>
              <Text variant="bodyXSmall" className="text-secondary mt-0.5">Your authentication credentials</Text>
            </Container>
            <button
              onClick={() => router.push("/api-keys")}
              className="flex items-center gap-1 text-brand-text-icons hover:underline cursor-pointer"
            >
              <Text variant="bodyXSmall" className="!text-[inherit] font-medium">View all</Text>
              <ChevronRightIcon size={13} />
            </button>
          </Container>

          {/* Counts */}
          <Container className="px-5 py-3 border-b border-border flex items-center gap-3">
            <Container className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-bg-light border border-success-border">
              <Container className="w-1.5 h-1.5 rounded-full bg-success-bg-bold shrink-0" />
              <Text variant="bodyXSmall" className="text-success-text-icons font-semibold tabular-nums">
                {keysLoading ? "—" : activeKeys.length} Active
              </Text>
            </Container>
            <Container className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
              <Container className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              <Text variant="bodyXSmall" className="text-secondary font-semibold tabular-nums">
                {keysLoading ? "—" : revokedKeys.length} Revoked
              </Text>
            </Container>
          </Container>

          {/* Key list */}
          <Container className="flex-1 px-5 py-1">
            {keysLoading ? (
              <>
                <KeySkeleton />
                <KeySkeleton />
                <KeySkeleton />
              </>
            ) : recentKeys.length === 0 ? (
              <Container className="py-6 flex flex-col items-center gap-2">
                <Text variant="bodyXSmall" className="text-secondary text-center">
                  No API keys yet. Create one to start authenticating requests.
                </Text>
              </Container>
            ) : (
              recentKeys.map((key) => (
                <Container
                  key={key.id}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                >
                  <Container className="flex items-center gap-2.5 min-w-0">
                    <Container
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        key.status === "ACTIVE" ? "bg-success-bg-bold" : "bg-danger-bg-bold"
                      }`}
                    />
                    <Text variant="bodyXSmall" className="text-primary font-medium truncate">
                      {key.name}
                    </Text>
                  </Container>
                  <Container className="flex items-center gap-2 shrink-0 ml-2">
                    <Container
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                        key.mode === "LIVE"
                          ? "bg-brand-bg-light text-brand-text-icons border-brand-border"
                          : "bg-warning-bg-light text-warning-text-icons border-warning-border"
                      }`}
                    >
                      {key.mode}
                    </Container>
                    <Text
                      variant="bodyXSmall"
                      className={`font-medium ${
                        key.status === "ACTIVE" ? "text-success-text-icons" : "text-secondary line-through"
                      }`}
                    >
                      {key.status === "ACTIVE" ? "Active" : "Revoked"}
                    </Text>
                  </Container>
                </Container>
              ))
            )}
          </Container>

          {/* CTA */}
          <Container className="px-5 py-4 border-t border-border">
            <Button
              variant="secondary"
              leftIcon={<AddIcon size={14} />}
              className="w-full"
              onClick={() => router.push("/api-keys")}
            >
              Create new key
            </Button>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
