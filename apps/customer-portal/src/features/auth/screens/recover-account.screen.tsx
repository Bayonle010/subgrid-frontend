"use client";

import { Button, Container, Input, Text } from "@subgrid/ui";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { useRouter } from "next/navigation";
import { NextIcon } from "@subgrid/ui/icons";
import { LoginInfo } from "../components/login-info";
import { useRecoverAccountScreen } from "../hooks/useAuth";

export const RecoverAccountScreen = () => {
  const router = useRouter();
  const { email, emailError, handleEmailChange, handleRecoverAccount, isPending } =
    useRecoverAccountScreen();
  return (
    <AuthWrapper
      subAuthLabel="Enter your email address. We will send you a password reset link."
      authLabel="Recover your account"
    >
      <Container
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleRecoverAccount();
        }}
        as="form"
      >
        <Container className="mb-4">
          <Input
            value={email}
            onChange={handleEmailChange}
            label="Email Address"
            required
            placeholder="example@mail.com"
            error={emailError}
          />
        </Container>

        <Container className="mt-8 w-full">
          <Button
            rightIcon={<NextIcon />}
            type="submit"
            variant="primary"
            className="w-full"
            loading={isPending}
          >
            Confirm Email
          </Button>
        </Container>
      </Container>

      <Container className="mt-6">
        <Text className="text-center text-primary" variant="bodySmall">
          Don&apos;t have an account?{"  "}
          <Container as="span">
            <Container
              onClick={() => {
                router.push("/register");
              }}
              as="button"
            >
              {" "}
              <Text variant="button" className="text-brand-tertiary-text-icons">
                {" "}
                Register
              </Text>
            </Container>
          </Container>
        </Text>
      </Container>
      <Container className="mt-8">
        <LoginInfo />
      </Container>
    </AuthWrapper>
  );
};
