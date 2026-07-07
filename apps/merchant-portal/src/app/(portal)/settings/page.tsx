"use client";
import { Container, Text, Input, Button } from "@subgrid/ui";
import { ThemeIcon, PayIcon, ChevronRightIcon, DrawerOutIcon, ScrollIcon } from "@subgrid/ui/icons";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const profile = user?.user;
  const router = useRouter();

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container>
        <Text variant="h4" className="text-primary">Settings</Text>
        <Text variant="bodySmall" className="text-secondary mt-0.5">
          Manage your account and business preferences.
        </Text>
      </Container>

      <Container className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <Container className="flex flex-col gap-6">
          <Container className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
            <Container className="flex items-center gap-3 pb-4 border-b border-border">
              <Container className="w-9 h-9 rounded-xl bg-brand-bg-light flex items-center justify-center">
                <ThemeIcon size={16} className="text-brand-text-icons" />
              </Container>
              <Container>
                <Text variant="bodySmall" className="text-primary font-semibold">Profile</Text>
                <Text variant="bodyXSmall" className="text-secondary">Your personal account details</Text>
              </Container>
            </Container>

            <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={profile?.firstName ?? ""}
                onChange={() => {}}
                disabled
              />
              <Input
                label="Last name"
                value={profile?.lastName ?? ""}
                onChange={() => {}}
                disabled
              />
            </Container>
            <Input
              label="Email address"
              value={profile?.email ?? ""}
              onChange={() => {}}
              disabled
            />
            <Input
              label="Role"
              value={profile?.role ?? ""}
              onChange={() => {}}
              disabled
            />

            <Container className="pt-2 flex justify-end">
              <Button variant="secondary" disabled>
                Save changes
              </Button>
            </Container>
          </Container>

          <button
            onClick={() => router.push("/webhooks")}
            className="w-full bg-surface border border-border rounded-2xl p-6 text-left hover:bg-muted/40 transition-colors cursor-pointer group"
          >
            <Container className="flex items-center justify-between">
              <Container className="flex items-center gap-4">
                <Container className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                  <DrawerOutIcon size={18} className="text-secondary" />
                </Container>
                <Container>
                  <Text variant="bodySmall" className="text-primary font-semibold">Webhooks</Text>
                  <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                    Register endpoints to receive real-time event notifications
                  </Text>
                </Container>
              </Container>
              <ChevronRightIcon size={16} className="text-secondary group-hover:text-primary transition-colors shrink-0" />
            </Container>
          </button>
        </Container>

        <Container className="flex flex-col gap-4">
          <Container className="bg-surface border border-border rounded-2xl p-5">
            <Text variant="h5" className="text-primary font-semibold mb-1">Account</Text>
            <Text variant="bodyXSmall" className="text-secondary mb-4">
              Tenant ID: <span className="font-mono text-primary">{user?.tenantId ?? "—"}</span>
            </Text>
            <Container className="h-px bg-border mb-4" />
            <Text variant="bodyXSmall" className="text-secondary">
              More settings coming soon — billing, notifications, and team members.
            </Text>
          </Container>

          <button
            onClick={() => router.push("/payouts")}
            className="w-full bg-surface border border-border rounded-2xl p-5 text-left hover:bg-muted/40 transition-colors cursor-pointer group"
          >
            <Container className="flex items-center justify-between">
              <Container className="flex items-center gap-3">
                <Container className="w-9 h-9 rounded-xl bg-brand-bg-light flex items-center justify-center shrink-0">
                  <PayIcon size={16} className="text-brand-text-icons" />
                </Container>
                <Container>
                  <Text variant="bodySmall" className="text-primary font-semibold">Banking & Payouts</Text>
                  <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                    Manage bank accounts and withdraw funds
                  </Text>
                </Container>
              </Container>
              <ChevronRightIcon size={16} className="text-secondary group-hover:text-primary transition-colors shrink-0" />
            </Container>
          </button>

          <button
            onClick={() => router.push("/withdrawals")}
            className="w-full bg-surface border border-border rounded-2xl p-5 text-left hover:bg-muted/40 transition-colors cursor-pointer group"
          >
            <Container className="flex items-center justify-between">
              <Container className="flex items-center gap-3">
                <Container className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                  <ScrollIcon size={16} className="text-secondary" />
                </Container>
                <Container>
                  <Text variant="bodySmall" className="text-primary font-semibold">Withdrawal History</Text>
                  <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                    View and track all past withdrawals
                  </Text>
                </Container>
              </Container>
              <ChevronRightIcon size={16} className="text-secondary group-hover:text-primary transition-colors shrink-0" />
            </Container>
          </button>
        </Container>
      </Container>
    </Container>
  );
}
