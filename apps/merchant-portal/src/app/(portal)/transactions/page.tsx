"use client";
import { Container, Text, Select } from "@subgrid/ui";
import { WalletIcon } from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useState } from "react";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("");

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Transactions</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            A full ledger of all billing events across your subscriptions.
          </Text>
        </Container>
        <Container className="w-48">
          <Select
            value={filter}
            onChange={setFilter}
            placeholder="All statuses"
            options={[
              { value: "all", label: "All statuses" },
              { value: "successful", label: "Successful" },
              { value: "failed", label: "Failed" },
              { value: "pending", label: "Pending" },
            ]}
          />
        </Container>
      </Container>

      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">All transactions</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">0 total</Text>
        </Container>
        <EmptyState
          icon={<WalletIcon size={22} className="text-secondary" />}
          title="No transactions yet"
          description="Billing transactions will appear here as customers are charged for their subscriptions."
        />
      </Container>
    </Container>
  );
}
