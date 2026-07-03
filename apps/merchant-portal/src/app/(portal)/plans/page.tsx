"use client";
import { Container, Text, Button } from "@subgrid/ui";
import { AddIcon, LegalIcon } from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";

export default function PlansPage() {
  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Plans</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            Define the subscription tiers your customers can sign up for.
          </Text>
        </Container>
        <Button variant="primary" leftIcon={<AddIcon size={16} />}>
          Create plan
        </Button>
      </Container>

      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">All plans</Text>
        </Container>
        <EmptyState
          icon={<LegalIcon size={22} className="text-secondary" />}
          title="No plans created yet"
          description="Create your first subscription plan to start offering your product to customers. Set pricing, billing cycles, and features."
          action={{ label: "Create your first plan", onClick: () => {} }}
        />
      </Container>
    </Container>
  );
}
