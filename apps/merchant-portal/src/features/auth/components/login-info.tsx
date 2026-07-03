import { Container, Text } from "@subgrid/ui";
import { InfoIcon } from "@subgrid/ui/icons";

export const LoginInfo = () => {
  return (
    <Container className="bg-brand-bg-light border border-brand-border rounded-xl p-4">
      <Container className="flex gap-3 items-start">
        <InfoIcon size={16} className="text-brand-text-icons mt-0.5 shrink-0" />
        <Container>
          <Text variant="bodyXSmall" className="text-primary font-medium">
            Need help accessing your account?
          </Text>
          <Text variant="bodyXSmall" className="text-secondary mt-1">
            Email us at{" "}
            <Container as="span">
              <Text variant="bodyXSmall" className="text-brand-text-icons font-medium">
                support@subgrid.io
              </Text>
            </Container>
          </Text>
        </Container>
      </Container>
    </Container>
  );
};
