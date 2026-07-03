"use client";
import { Button, Container, Input, Text } from "@subgrid/ui";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { NextIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";
import { LoginInfo } from "../components/login-info";
import { useLoginScreen } from "../hooks/useAuth";
import React from "react";

export const LoginScreen = () => {
  const router = useRouter();
  const {
    formData,
    errors,
    serverError,
    handleChange,
    handleLogin,
    isPending,
  } = useLoginScreen();

  return (
    <AuthWrapper authLabel="Welcome back! 😎">
      <Container
        as="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Container className="mb-4">
          <Input
            label="Email Address"
            required
            placeholder="example@mail.com"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
          />
        </Container>
        <Container className="mb-4">
          <Input
            type="password"
            label="Password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
          />
          <Container className="flex justify-end mt-2">
            <Container
              onClick={() => router.push("recover-account")}
              as="button"
              type="button"
            >
              <Text
                variant="button"
                className="text-brand-secondary-text-icons"
              >
                Forgot password
              </Text>
            </Container>
          </Container>
        </Container>

       

        <Container className="mt-8 w-full">
          <Button
            type="button"
            rightIcon={<NextIcon />}
            onClick={handleLogin}
            variant="primary"
            className="w-full"
            disabled={isPending}
            loading={isPending}
          >
            Login
          </Button>
        </Container>
      </Container>

      <Container className="mt-6">
        <Text className="text-center text-primary" variant="bodySmall">
          Don&apos;t have an account?{"  "}
          <Container as="span">
            <Container onClick={() => router.push("/register")} as="button">
              <Text variant="button" className="text-brand-tertiary-text-icons">
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
