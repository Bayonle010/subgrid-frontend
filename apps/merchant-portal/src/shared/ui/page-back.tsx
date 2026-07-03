"use client";
import { Container, Text } from "@subgrid/ui";
import { BackIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";
import React from "react";

export const PageBack = () => {
  const router = useRouter();
  return (
    <Container
      as="button"
      onClick={() => {
        router.back();
      }}
      className="bg-muted px-2 flex gap-2 py-1 items-center rounded-lg"
    >
      <BackIcon size={20} className="text-primary" />
      <Text tone="primary" variant="buttonXS">
        Back
      </Text>
    </Container>
  );
};
