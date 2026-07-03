"use client";
import React from "react";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, OtpInput, Text } from "@subgrid/ui";
import { TickIcon, NotificationIcon } from "@subgrid/ui/icons";
import { useVerifyEmailScreen } from "../hooks/useAuth";

export const VerifyEmailScreen = () => {
  const { email, otp, setOtp, otpError, handleVerifyEmail, handleResendOtp, isVerifying, isResending } =
    useVerifyEmailScreen();

  return (
    <AuthWrapper
      authLabel="Check your inbox."
      subAuthLabel={`We sent a 6-digit code to ${email || "your email address"}.`}
    >
      <Container className="flex flex-col items-center mb-8 gap-3">
        <Container className="w-14 h-14 rounded-2xl bg-brand-bg-light border border-brand-border flex items-center justify-center">
          <NotificationIcon size={24} className="text-brand-text-icons" />
        </Container>
      </Container>

      <Container as="form" onSubmit={handleVerifyEmail} className="flex flex-col gap-5">
        <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={isVerifying} />

        <Button
          rightIcon={<TickIcon size={18} />}
          type="submit"
          variant="primary"
          className="w-full"
          disabled={otp.length < 6 || isVerifying}
          loading={isVerifying}
        >
          Verify email
        </Button>
      </Container>

      <Container className="mt-6 text-center">
        <Text variant="bodySmall" className="text-secondary">
          Didn&apos;t receive the code?{" "}
          <Container as="span">
            <Container as="button" type="button" onClick={handleResendOtp} disabled={isResending} className="cursor-pointer">
              <Text variant="bodySmall" className="text-brand-text-icons font-medium hover:underline">
                {isResending ? "Sending…" : "Resend code"}
              </Text>
            </Container>
          </Container>
        </Text>
      </Container>
    </AuthWrapper>
  );
};
