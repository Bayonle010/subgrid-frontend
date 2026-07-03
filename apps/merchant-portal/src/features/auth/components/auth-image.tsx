"use client";
import { Container, Text } from "@subgrid/ui";
import { CheckIcon, WalletIcon, ScrollIcon, UserIcon, AddIcon } from "@subgrid/ui/icons";

const MetricCard = ({
  label,
  value,
  change,
  positive = true,
}: {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) => (
  <Container className="bg-white/8 border border-white/12 rounded-2xl p-4">
    <Text variant="bodyXSmall" className="text-white/60 uppercase tracking-widest">
      {label}
    </Text>
    <Text variant="h3" className="text-inverted mt-1">
      {value}
    </Text>
    <Container className="flex items-center gap-1 mt-1">
      <Container
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          positive ? "bg-brand-tertiary-bg-bold" : "bg-danger-bg-bold"
        }`}
      >
        <span className="text-[8px] font-bold text-[#080A58]">{positive ? "↑" : "↓"}</span>
      </Container>
      <Text variant="bodyXSmall" className={positive ? "text-brand-tertiary-text-icons" : "text-danger-text-icons"}>
        {change}
      </Text>
    </Container>
  </Container>
);

const Feature = ({ text }: { text: string }) => (
  <Container className="flex items-center gap-3">
    <Container className="w-5 h-5 rounded-full bg-brand-tertiary-bg-bold flex items-center justify-center shrink-0">
      <CheckIcon size={11} className="text-[#080A58]" />
    </Container>
    <Text variant="bodySmall" className="text-white/75">
      {text}
    </Text>
  </Container>
);

export const AuthImage = () => {
  return (
    <Container className="relative w-full h-full bg-brand-bg-bold flex flex-col justify-between px-10 py-12 overflow-hidden">
      <Container
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Container className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-tertiary-bg-bold/5 -translate-y-1/2 translate-x-1/2" />
      <Container className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/3 translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <Container className="flex items-center gap-2 mb-2">
          <Container className="w-8 h-8 rounded-lg bg-brand-tertiary-bg-bold flex items-center justify-center">
            <WalletIcon size={16} className="text-[#080A58]" />
          </Container>
          <Text variant="h5" className="text-inverted font-semibold tracking-tight">
            SubGrid
          </Text>
        </Container>
      </Container>

      <Container className="relative z-10 flex flex-col gap-6">
        <Container>
          <Text variant="h2" className="text-inverted leading-tight">
            Subscription infrastructure for your product.
          </Text>
          <Text variant="bodySmall" className="text-white/55 mt-3">
            Integrate once. Let SubGrid handle plans, billing cycles, and renewals — powered by Nomba.
          </Text>
        </Container>

        <Container className="grid grid-cols-2 gap-3">
          <MetricCard label="Monthly Recurring Revenue" value="₦4.23M" change="+12.4% vs last month" />
          <MetricCard label="Active Subscribers" value="1,247" change="+8.2% vs last month" />
        </Container>

        <Container className="bg-white/6 border border-white/10 rounded-2xl p-4">
          <Container className="flex items-center justify-between mb-3">
            <Text variant="bodyXSmall" className="text-white/50 uppercase tracking-widest">
              Recent activity
            </Text>
            <Container className="px-2 py-0.5 rounded-full bg-brand-tertiary-bg-bold">
              <Text variant="bodyXSmall" className="text-[#080A58] font-semibold">
                Live
              </Text>
            </Container>
          </Container>
          {[
            { name: "Paystack Clone Co.", plan: "Growth", amount: "₦25,000" },
            { name: "Lendsqr Finance", plan: "Enterprise", amount: "₦120,000" },
            { name: "Cowrywise App", plan: "Starter", amount: "₦5,000" },
          ].map((row) => (
            <Container
              key={row.name}
              className="flex items-center justify-between py-2 border-b border-white/8 last:border-0"
            >
              <Container>
                <Text variant="bodyXSmall" className="text-inverted">
                  {row.name}
                </Text>
                <Text variant="bodyXSmall" className="text-white/45">
                  {row.plan}
                </Text>
              </Container>
              <Text variant="bodyXSmall" className="text-brand-tertiary-text-icons font-semibold">
                {row.amount}
              </Text>
            </Container>
          ))}
        </Container>

        <Container className="flex flex-col gap-3">
          <Feature text="One-line Nomba payment integration" />
          <Feature text="Unlimited plan tiers and billing cycles" />
          <Feature text="Webhooks, analytics, and a customer portal" />
        </Container>
      </Container>

      <Container className="relative z-10">
        <Text variant="bodyXSmall" className="text-white/35">
          Trusted by 500+ products across Africa
        </Text>
      </Container>
    </Container>
  );
};
