"use client";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, Text } from "@subgrid/ui";
import { NextIcon, SuccessIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";

export const RegistrationSuccessScreen = () => {
  const router = useRouter();
  return (
    <AuthWrapper authLabel="" subAuthLabel="">
      <Container className="flex flex-col items-center text-center gap-6 py-4">
        <Container className="w-20 h-20 rounded-full bg-brand-tertiary-bg-light border border-brand-tertiary-border flex items-center justify-center">
          <SuccessIcon size={40} className="text-brand-text-icons" />
        </Container>
        <Container>
          <Text variant="h3" className="text-primary">
            You&apos;re all set.
          </Text>
          <Text variant="bodySmall" className="text-secondary mt-2 max-w-xs mx-auto">
            Your SubGrid account is ready. Sign in to create your first subscription plan.
          </Text>
        </Container>
        <Button
          rightIcon={<NextIcon />}
          type="button"
          variant="primary"
          className="w-full"
          onClick={() => router.replace("/login")}
        >
          Go to sign in
        </Button>
      </Container>
    </AuthWrapper>
  );
};
