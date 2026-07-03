import { Container, Text } from "@subgrid/ui";
import React from "react";
import { PortalWrapper } from "./portal-wrapper";
import { PlaceholderIcon, ScrollIcon, WalletIcon, UserIcon } from "@subgrid/ui/icons";

export const PortalSubNav = () => {
  const items = [
    { label: "Dashboard", href: "/dashboard", icon: <PlaceholderIcon size={20} className="text-inverted" /> },
    { label: "Subscriptions", href: "/subscriptions", icon: <ScrollIcon size={20} className="text-inverted" /> },
    { label: "Billing", href: "/billing", icon: <WalletIcon size={20} className="text-inverted" /> },
    { label: "Profile", href: "/profile", icon: <UserIcon size={20} className="text-inverted" /> },
  ];

  return (
    <Container className="py-4 bg-brand-bg-bold">
      <PortalWrapper>
        <Container className="flex items-center gap-2">
          {items.map((item) => (
            <Container key={item.label} className="flex items-center gap-2 cursor-pointer px-3">
              {item.icon}
              <Text variant="bodyXSmall" className="text-inverted">{item.label}</Text>
            </Container>
          ))}
        </Container>
      </PortalWrapper>
    </Container>
  );
};
