import { Checkbox, Container } from "@subgrid/ui";

export const TermsPolicy = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <Container className="flex items-start gap-3">
      <Container className="mt-0.5 shrink-0">
        <Checkbox checked={checked} onChange={onChange} />
      </Container>
      <p className="text-xs text-[var(--secondary)] leading-relaxed">
        I agree to the{" "}
        <span className="text-[var(--brand-text-icons)] font-medium cursor-pointer hover:underline">
          Terms of Service
        </span>
        {" "}and{" "}
        <span className="text-[var(--brand-text-icons)] font-medium cursor-pointer hover:underline">
          Privacy Policy
        </span>
      </p>
    </Container>
  );
};
