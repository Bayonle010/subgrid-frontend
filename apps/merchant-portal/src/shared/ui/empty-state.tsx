import { Container, Text, Button } from "@subgrid/ui";
import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Container className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
    <Container className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
      {icon}
    </Container>
    <Container className="flex flex-col gap-1 max-w-xs">
      <Text variant="bodySmall" className="text-primary font-semibold">
        {title}
      </Text>
      <Text variant="bodyXSmall" className="text-secondary leading-relaxed">
        {description}
      </Text>
    </Container>
    {action && (
      <Button variant="secondary" size="small" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </Container>
);
