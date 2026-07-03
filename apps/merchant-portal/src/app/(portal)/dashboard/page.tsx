"use client";
import React from "react";
import { Container, Text, Input, Select, Button } from "@subgrid/ui";
import {
  WalletIcon,
  UserIcon,
  LegalIcon,
  SuccessIcon,
  WarningIcon,
  DangerIcon,
  PendingIcon,
  CopyIcon,
  ScrollIcon,
  AddIcon,
  ChevronRightIcon,
} from "@subgrid/ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/shared/ui/empty-state";
import { useListApiKeys } from "@/features/api-keys/hooks/api-key.hooks";

type Status = "active" | "trialing" | "cancelled" | "past_due";

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; className: string }> = {
  active: {
    label: "Active",
    icon: <SuccessIcon size={12} className="text-success-text-icons" />,
    className: "bg-success-bg-light text-success-text-icons border-success-border",
  },
  trialing: {
    label: "Trial",
    icon: <PendingIcon size={12} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  cancelled: {
    label: "Cancelled",
    icon: <DangerIcon size={12} className="text-danger-text-icons" />,
    className: "bg-danger-bg-light text-danger-text-icons border-danger-border",
  },
  past_due: {
    label: "Past due",
    icon: <WarningIcon size={12} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
};

const subscriptions: {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: string;
  cycle: string;
  status: Status;
  date: string;
}[] = [];

const StatCard = ({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
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
    <Container>
      <Text variant="h3" className={accent ? "text-inverted" : "text-primary"}>
        {value}
      </Text>
      <Text variant="bodyXSmall" className={accent ? "text-white/50 mt-0.5" : "text-secondary mt-0.5"}>
        {sub}
      </Text>
    </Container>
  </Container>
);

const StatusBadge = ({ status }: { status: Status }) => {
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
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const router = useRouter();

  const { data: apiKeys, isLoading: keysLoading } = useListApiKeys();

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      !search ||
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = !planFilter || planFilter === "all" || s.plan === planFilter;
    return matchSearch && matchPlan;
  });

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
        <StatCard
          label="Monthly Revenue"
          value="—"
          sub="No data yet"
          icon={<WalletIcon size={16} className="text-brand-text-icons" />}
          accent
        />
        <StatCard
          label="Active Subscriptions"
          value="—"
          sub="No data yet"
          icon={<ScrollIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Total Customers"
          value="—"
          sub="No data yet"
          icon={<UserIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Plans Available"
          value="—"
          sub="No data yet"
          icon={<LegalIcon size={16} className="text-secondary" />}
        />
      </Container>

      <Container className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Subscriptions table */}
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Container className="px-4 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <Text variant="h5" className="text-primary font-semibold">
              Recent subscriptions
            </Text>
            <Container className="flex items-center gap-2 w-full sm:w-auto">
              <Container className="flex-1 sm:w-48">
                <Input
                  placeholder="Search customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Container>
              <Container className="flex-1 sm:w-36">
                <Select
                  value={planFilter}
                  onChange={setPlanFilter}
                  placeholder="All plans"
                  options={[
                    { value: "all", label: "All plans" },
                    { value: "Starter", label: "Starter" },
                    { value: "Growth", label: "Growth" },
                    { value: "Enterprise", label: "Enterprise" },
                  ]}
                />
              </Container>
            </Container>
          </Container>

          <Container className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Customer", "Plan", "Amount", "Cycle", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left">
                      <Text variant="bodyXSmall" className="text-secondary uppercase tracking-wider font-medium">
                        {h}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <Text variant="bodySmall" className="text-primary font-medium">{row.customer}</Text>
                      <Text variant="bodyXSmall" className="text-secondary">{row.email}</Text>
                    </td>
                    <td className="px-5 py-4">
                      <Container className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-bg-light border border-brand-border">
                        <Text variant="bodyXSmall" className="text-brand-text-icons font-medium">{row.plan}</Text>
                      </Container>
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">{row.amount}</Text>
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodyXSmall" className="text-secondary">{row.cycle}</Text>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodyXSmall" className="text-secondary">{row.date}</Text>
                    </td>
                    <td className="px-5 py-4">
                      <Container className="flex items-center gap-1.5 text-secondary">
                        <CopyIcon size={14} />
                        <Text variant="bodyXSmall" className="!text-[inherit]">{row.id}</Text>
                      </Container>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={<ScrollIcon size={22} className="text-secondary" />}
                        title="No subscriptions found"
                        description={
                          search || planFilter
                            ? "No subscriptions match your current filters. Try adjusting your search."
                            : "You don't have any active subscriptions yet. They'll appear here once customers subscribe to your plans."
                        }
                      />
                    </td>
                  </tr>
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
