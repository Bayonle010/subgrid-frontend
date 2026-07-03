import { Container, Text } from "@subgrid/ui";
import { TickIcon } from "@subgrid/ui/icons";

export const PasswordRequirement = ({
  passed,
  requirement,
}: {
  passed: boolean;
  requirement: string;
}) => {
  return (
    <Container
      as="span"
      className={`flex items-center border px-2 py-1 rounded-4xl gap-2 ${passed ? "bg-brand-tertiary-bg-light border-brand-tertiary-border" : "bg-muted border-border"}`}
    >
      <Text
        className={`${passed ? "text-primary" : "text-secondary"}`}
        variant="bodyXSmall"
      >
        {requirement}
      </Text>
      <TickIcon
        size={12}
        className={`${passed ? "text-primary" : "text-secondary"}`}
      />
    </Container>
  );
};
