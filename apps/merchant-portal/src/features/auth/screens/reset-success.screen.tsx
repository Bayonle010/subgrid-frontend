"use client";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, Text } from "@subgrid/ui";
import { NextIcon, SuccessIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";

const ResetSuccessScreen = () => {
  const router = useRouter();
  return (
    <AuthWrapper authLabel="" subAuthLabel="">
      <Container className="flex flex-col items-center text-center gap-6 py-4">
        <Container className="w-20 h-20 rounded-full bg-success-bg-light border border-success-border flex items-center justify-center">
          <SuccessIcon size={40} className="text-success-text-icons" />
        </Container>
        <Container>
          <Text variant="h3" className="text-primary">
            Password updated.
          </Text>
          <Text variant="bodySmall" className="text-secondary mt-2 max-w-xs mx-auto">
            Your password has been changed. Sign in to access your dashboard.
          </Text>
        </Container>
        <Button
          rightIcon={<NextIcon />}
          type="button"
          variant="primary"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Back to sign in
        </Button>
      </Container>
    </AuthWrapper>
  );
};

export default ResetSuccessScreen;
