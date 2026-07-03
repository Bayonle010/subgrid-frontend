"use client";
import { Container, Text, Input } from "@subgrid/ui";
import { UserIcon } from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useState } from "react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Customers</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            View and manage all subscribers across your plans.
          </Text>
        </Container>
        <Container className="w-64">
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Container>
      </Container>

      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">All customers</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">0 total</Text>
        </Container>
        <EmptyState
          icon={<UserIcon size={22} className="text-secondary" />}
          title="No customers yet"
          description="Customers will appear here once they subscribe to one of your plans. Share your checkout link to get started."
        />
      </Container>
    </Container>
  );
}
