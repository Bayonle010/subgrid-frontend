"use client";
import { Container, Text } from "@subgrid/ui";
import React from "react";
import { NavItemType } from "../types/shared.types";
import { usePathname, useRouter } from "next/navigation";

export const PortalNavItem = ({ item }: { item: NavItemType }) => {
  const pathName = usePathname();
  const currentPath = pathName.split("/")[1];
  const active = currentPath.includes(item.slug);
  const router = useRouter();
  return (
    <Container
      onClick={() => {
        router.push(item.link);
      }}
      className={`${active ? "bg-brand-secondary-bg-bold" : "bg-muted"} rounded-full flex cursor-pointer items-center gap-2 px-4 py-3`}
    >
      {active ? item.icon : item.inActiveIcon}
      <Text
        variant="bodyXSmall"
        className={`${active ? "text-inverted" : "text-primary"} `}
      >
        {item.title}
      </Text>
    </Container>
  );
};
