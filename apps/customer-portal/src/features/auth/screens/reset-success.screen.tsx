"use client";
import React from "react";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, Text } from "@subgrid/ui";
import { NextIcon, SuccessIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";

const ResetSuccessScreen = () => {
  const router = useRouter();
  return (
    <AuthWrapper authLabel="" subAuthLabel="">
      <Container className="flex items-center justify-center flex-col">
        <SuccessIcon size={120} className="text-success-text-icons" />
        <Container className="mt-18">
          <Text variant="h3" className="text-primary text-center">
            Password reset <br /> Successfully
          </Text>
          <Text
            variant="bodySmall"
            className="w-4/5 mt-2 mx-auto text-secondary text-center"
          >
            Your account has been setup with your new password, proceed to login
          </Text>
        </Container>
        <Container className="w-full mt-6">
          <Button
            rightIcon={<NextIcon />}
            type="submit"
            variant="primary"
            className="w-full"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
        </Container>
      </Container>
    </AuthWrapper>
  );
};

export default ResetSuccessScreen;
