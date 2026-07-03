import { Checkbox, Container, Text } from "@subgrid/ui";

export const TermsPolicy = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <Container className="flex items-center gap-2">
      <Checkbox checked={checked} onChange={onChange} />
      <Text className="text-primary" variant="buttonXS">
        I have read and agree to the {""}
        <Container as={"span"}>
          <Text variant="buttonXS" className="text-brand-tertiary-text-icons">
            Terms of Use
          </Text>
        </Container>{" "}
        and{" "}
        <Container as={"span"}>
          <Text variant="buttonXS" className="text-brand-tertiary-text-icons">
            Privacy Policy
          </Text>
        </Container>
      </Text>
    </Container>
  );
};
