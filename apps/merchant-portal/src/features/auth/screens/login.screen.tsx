"use client";
import { Button, Container, Input, Text } from "@subgrid/ui";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { NextIcon, DangerIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";
import { LoginInfo } from "../components/login-info";
import { useLoginScreen } from "../hooks/useAuth";
import React from "react";

export const LoginScreen = () => {
  const router = useRouter();
  const { formData, errors, serverError, handleChange, handleLogin, isPending } =
    useLoginScreen();

  return (
    <AuthWrapper authLabel="Welcome back." subAuthLabel="Sign in to your merchant dashboard.">
      <Container
        as="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Email address"
          required
          placeholder="you@company.com"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          error={errors.email}
        />

        <Container>
          <Input
            type="password"
            label="Password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
          />
          <Container className="flex justify-end mt-1.5">
            <Container
              onClick={() => router.push("/recover-account")}
              as="button"
              type="button"
              className="cursor-pointer"
            >
              <Text variant="bodyXSmall" className="text-brand-text-icons font-medium hover:underline">
                Forgot password?
              </Text>
            </Container>
          </Container>
        </Container>

        {serverError && (
          <Container className="flex items-start gap-3 bg-danger-bg-light border border-danger-border rounded-xl p-3">
            <DangerIcon size={16} className="text-danger-text-icons mt-0.5 shrink-0" />
            <Text variant="bodyXSmall" className="text-danger-text-icons">
              {serverError}
            </Text>
          </Container>
        )}

        <Container className="pt-2">
          <Button
            type="submit"
            rightIcon={<NextIcon />}
            variant="primary"
            className="w-full"
            disabled={isPending}
            loading={isPending}
          >
            Sign in
          </Button>
        </Container>
      </Container>

      <Container className="mt-6 text-center">
        <Text variant="bodySmall" className="text-secondary">
          No account yet?{" "}
          <Container as="span">
            <Container onClick={() => router.push("/register")} as="button" className="cursor-pointer">
              <Text variant="bodySmall" className="text-brand-text-icons font-medium hover:underline">
                Create one
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
