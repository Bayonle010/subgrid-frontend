"use client";

import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, Input, Text } from "@subgrid/ui";
import { PasswordRequirement } from "../components/pword-requirement";
import { TickIcon } from "@subgrid/ui/icons";
import { LoginInfo } from "../components/login-info";
import { useRouter } from "next/navigation";
import { useResetPasswordScreen } from "../hooks/useAuth";

export const ResetPasswordScreen = () => {
  const router = useRouter();
  const {
    newPassword,
    confirmPassword,
    errors,
    isPending,
    requirements,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleResetPassword,
  } = useResetPasswordScreen();

  return (
    <AuthWrapper authLabel="Reset your account password">
      <Container
        as="form"
        onSubmit={handleResetPassword}
      >
        <Container className="mb-4">
          <Input
            label="New Password"
            required
            placeholder="Enter password"
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
          />
        </Container>

        <Container className="flex items-center gap-2 flex-wrap mb-6">
          {requirements.map((req) => (
            <PasswordRequirement
              key={req.label}
              passed={req.passed}
              requirement={req.label}
            />
          ))}
        </Container>

        <Container className="mb-4">
          <Input
            label="Confirm Password"
            required
            placeholder="Re-enter password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={errors.confirmPassword}
          />
        </Container>

        <Container className="mt-8 w-full">
          <Button
            rightIcon={<TickIcon size={20} />}
            type="submit"
            variant="primary"
            className="w-full"
            loading={isPending}
          >
            Save Password
          </Button>
        </Container>

        <Container className="mt-6">
          <Text className="text-center text-primary" variant="bodySmall">
            Don&apos;t have an account?{"  "}
            <Container as="span">
              <Container
                onClick={() => router.push("/register")}
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
      </Container>
    </AuthWrapper>
  );
};
