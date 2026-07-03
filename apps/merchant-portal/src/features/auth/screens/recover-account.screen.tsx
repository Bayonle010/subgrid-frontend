"use client";
import { Button, Container, Input, Text } from "@subgrid/ui";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { useRouter } from "next/navigation";
import { NextIcon } from "@subgrid/ui/icons";
import { LoginInfo } from "../components/login-info";
import { useRecoverAccountScreen } from "../hooks/useAuth";
import React from "react";

export const RecoverAccountScreen = () => {
  const router = useRouter();
  const { email, emailError, handleEmailChange, handleRecoverAccount, isPending } =
    useRecoverAccountScreen();

  return (
    <AuthWrapper
      authLabel="Recover your account."
      subAuthLabel="Enter your registered email and we'll send a reset link."
    >
      <Container
        as="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleRecoverAccount();
        }}
        className="flex flex-col gap-4"
      >
        <Input
          value={email}
          onChange={handleEmailChange}
          label="Email address"
          required
          placeholder="you@company.com"
          error={emailError}
        />

        <Button
          rightIcon={<NextIcon />}
          type="submit"
          variant="primary"
          className="w-full"
          loading={isPending}
        >
          Send reset link
        </Button>
      </Container>

      <Container className="mt-6 text-center">
        <Text variant="bodySmall" className="text-secondary">
          Remember your password?{" "}
          <Container as="span">
            <Container onClick={() => router.push("/login")} as="button" className="cursor-pointer">
              <Text variant="bodySmall" className="text-brand-text-icons font-medium hover:underline">
                Sign in
              </Text>
            </Container>
          </Container>
        </Text>
      </Container>

      <Container className="mt-6">
        <LoginInfo />
      </Container>
    </AuthWrapper>
  );
};
