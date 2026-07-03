import { Container, Text } from "@subgrid/ui";
import { CheckIcon } from "@subgrid/ui/icons";

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
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors ${
        passed
          ? "bg-brand-tertiary-bg-light border-brand-tertiary-border text-primary"
          : "bg-muted border-border text-secondary"
      }`}
    >
      <CheckIcon
        size={10}
        className={passed ? "text-brand-text-icons" : "text-secondary"}
      />
      <Text variant="bodyXSmall" className="!text-[inherit]">
        {requirement}
      </Text>
    </Container>
  );
};
