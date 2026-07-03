"use client";
import React from "react";
import { Container, Text, Button, Input, Select, Textarea, Radio, CountrySelector, DEFAULT_COUNTRY } from "@subgrid/ui";
import type { Country } from "@subgrid/ui";
import {
  AddIcon,
  WalletIcon,
  UserIcon,
  LegalIcon,
  SuccessIcon,
  WarningIcon,
  DangerIcon,
  PendingIcon,
  CopyIcon,
  ChevronDownIcon,
  DateIcon,
  ScrollIcon,
} from "@subgrid/ui/icons";
import { useState } from "react";

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

const subscriptions = [
  { id: "SUB-001", customer: "Paystack Clone Co.", email: "billing@paystackclone.io", plan: "Enterprise", amount: "₦120,000", cycle: "Monthly", status: "active" as Status, date: "Jun 25, 2026" },
  { id: "SUB-002", customer: "Lendsqr Finance", email: "ops@lendsqr.dev", plan: "Growth", amount: "₦45,000", cycle: "Monthly", status: "active" as Status, date: "Jun 23, 2026" },
  { id: "SUB-003", customer: "Cowrywise App", email: "finance@cowrywise.ng", plan: "Starter", amount: "₦5,000", cycle: "Monthly", status: "trialing" as Status, date: "Jun 22, 2026" },
  { id: "SUB-004", customer: "Flutterwave Demo", email: "dev@demo.fw.io", plan: "Growth", amount: "₦45,000", cycle: "Quarterly", status: "past_due" as Status, date: "Jun 18, 2026" },
  { id: "SUB-005", customer: "Kuda MFB Ltd.", email: "subs@kuda.app", plan: "Enterprise", amount: "₦120,000", cycle: "Annual", status: "active" as Status, date: "Jun 15, 2026" },
  { id: "SUB-006", customer: "Risevest Savings", email: "tech@risevest.com", plan: "Starter", amount: "₦5,000", cycle: "Monthly", status: "cancelled" as Status, date: "Jun 10, 2026" },
];

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
      <Container
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          accent ? "bg-white/12" : "bg-muted"
        }`}
      >
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

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      !search ||
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = !planFilter || planFilter === "all" || s.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Container className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">
            Dashboard
          </Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            Overview of your subscription business
          </Text>
        </Container>
        <Container className="flex items-center gap-4 flex-wrap">
          <Container className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-2">
            <Text variant="bodyXSmall" className="text-secondary">Period:</Text>
            <Container className="flex items-center gap-3">
              {[
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "annual", label: "Annual" },
              ].map((opt) => (
                <Radio
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={period === opt.value}
                  onChange={() => setPeriod(opt.value)}
                />
              ))}
            </Container>
          </Container>
          <Button variant="primary" leftIcon={<AddIcon size={16} />}>
            New plan
          </Button>
        </Container>
      </Container>

      <Container className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Revenue"
          value="₦4.23M"
          sub="↑ 12.4% from last month"
          icon={<WalletIcon size={16} className="text-brand-text-icons" />}
          accent
        />
        <StatCard
          label="Active Subscriptions"
          value="1,247"
          sub="↑ 8.2% from last month"
          icon={<ScrollIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Total Customers"
          value="3,891"
          sub="↑ 5.1% from last month"
          icon={<UserIcon size={16} className="text-secondary" />}
        />
        <StatCard
          label="Plans Available"
          value="5"
          sub="Starter · Growth · Enterprise"
          icon={<LegalIcon size={16} className="text-secondary" />}
        />
      </Container>

      <Container className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Container className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <Text variant="h5" className="text-primary font-semibold">
              Recent subscriptions
            </Text>
            <Container className="flex items-center gap-2">
              <Container className="w-48">
                <Input
                  placeholder="Search customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Container>
              <Container className="w-36">
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
                    <th
                      key={h}
                      className="px-5 py-3 text-left"
                    >
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
                      <Text variant="bodySmall" className="text-primary font-medium">
                        {row.customer}
                      </Text>
                      <Text variant="bodyXSmall" className="text-secondary">
                        {row.email}
                      </Text>
                    </td>
                    <td className="px-5 py-4">
                      <Container className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-bg-light border border-brand-border">
                        <Text variant="bodyXSmall" className="text-brand-text-icons font-medium">
                          {row.plan}
                        </Text>
                      </Container>
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">
                        {row.amount}
                      </Text>
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodyXSmall" className="text-secondary">
                        {row.cycle}
                      </Text>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Text variant="bodyXSmall" className="text-secondary">
                        {row.date}
                      </Text>
                    </td>
                    <td className="px-5 py-4">
                      <Container
                        as="button"
                        onClick={() => copy(row.id)}
                        className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        <CopyIcon size={14} />
                        <Text variant="bodyXSmall" className="!text-[inherit]">
                          {copied === row.id ? "Copied!" : row.id}
                        </Text>
                      </Container>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center">
                      <Text variant="bodySmall" className="text-secondary">
                        No subscriptions match your search.
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Container>
        </Container>

        <Container className="flex flex-col gap-4">
          <Container className="bg-surface border border-border rounded-2xl p-5">
            <Text variant="h5" className="text-primary font-semibold mb-4">
              Revenue split
            </Text>
            {[
              { plan: "Enterprise", revenue: "₦2.1M", pct: 49, color: "bg-brand-bg-bold" },
              { plan: "Growth", revenue: "₦1.4M", pct: 34, color: "bg-brand-secondary-bg-bold" },
              { plan: "Starter", revenue: "₦730K", pct: 17, color: "bg-brand-tertiary-bg-bold" },
            ].map((row) => (
              <Container key={row.plan} className="mb-4 last:mb-0">
                <Container className="flex items-center justify-between mb-1.5">
                  <Text variant="bodyXSmall" className="text-primary font-medium">
                    {row.plan}
                  </Text>
                  <Container className="flex items-center gap-2">
                    <Text variant="bodyXSmall" className="text-secondary">
                      {row.pct}%
                    </Text>
                    <Text variant="bodyXSmall" className="text-primary font-semibold tabular-nums">
                      {row.revenue}
                    </Text>
                  </Container>
                </Container>
                <Container className="h-2 rounded-full bg-muted overflow-hidden">
                  <Container
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </Container>
              </Container>
            ))}
          </Container>

          <Container className="bg-surface border border-border rounded-2xl p-5">
            <Text variant="h5" className="text-primary font-semibold mb-1">
              Your API key
            </Text>
            <Text variant="bodyXSmall" className="text-secondary mb-4">
              Use this key to authenticate API requests.
            </Text>
            <Container className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 border border-border">
              <Text variant="bodyXSmall" className="text-secondary font-mono flex-1 truncate">
                sf_live_sk_xk9m3...nQP2
              </Text>
              <Container
                as="button"
                onClick={() => copy("sf_live_sk_xk9m3nQP2")}
                className="text-secondary hover:text-primary transition-colors cursor-pointer shrink-0"
              >
                <CopyIcon size={14} />
              </Container>
            </Container>
          </Container>

          <Container className="bg-surface border border-border rounded-2xl p-5">
            <Text variant="h5" className="text-primary font-semibold mb-1">
              Market region
            </Text>
            <Text variant="bodyXSmall" className="text-secondary mb-3">
              Filter analytics by customer country.
            </Text>
            <CountrySelector
              value={country}
              onChange={setCountry}
            />
          </Container>

          <Container className="bg-surface border border-border rounded-2xl p-5">
            <Text variant="h5" className="text-primary font-semibold mb-1">
              Support note
            </Text>
            <Text variant="bodyXSmall" className="text-secondary mb-3">
              Leave a note for the SubGrid support team.
            </Text>
            <Textarea
              placeholder="Describe your issue or question…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Container className="mt-3">
              <Button variant="secondary" className="w-full" disabled={!notes.trim()}>
                Send to support
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
