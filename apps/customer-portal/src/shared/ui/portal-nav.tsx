"use client";
import { Container, Text } from "@subgrid/ui";
import Image from "next/image";
import { PortalWrapper } from "./portal-wrapper";
import {
  ChevronDownIcon,
  DarkModeIcon,
  LightModeIcon,
  NotificationIcon,
  UserIcon,
  WalletIcon,
  ScrollIcon,
  PlaceholderIcon,
} from "@subgrid/ui/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { PortalNavItem } from "./portal-nav-item";
import { NavItemType } from "../types/shared.types";

export const PortalNav = () => {
  const { theme, toggleTheme } = useTheme();
  const navItems: NavItemType[] = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: <PlaceholderIcon size={20} className="text-inverted" />,
      inActiveIcon: <PlaceholderIcon size={20} className="text-primary" />,
      slug: "dashboard",
    },
    {
      title: "Subscriptions",
      link: "/subscriptions",
      icon: <ScrollIcon size={20} className="text-inverted" />,
      inActiveIcon: <ScrollIcon size={20} className="text-primary" />,
      slug: "subscriptions",
    },
    {
      title: "Billing",
      link: "/billing",
      icon: <WalletIcon size={20} className="text-inverted" />,
      inActiveIcon: <WalletIcon size={20} className="text-primary" />,
      slug: "billing",
    },
    {
      title: "Profile",
      link: "/profile",
      icon: <UserIcon size={20} className="text-inverted" />,
      inActiveIcon: <UserIcon size={20} className="text-primary" />,
      slug: "profile",
    },
  ];

  return (
    <PortalWrapper>
      <Container className="flex items-center justify-between py-4">
        <Container className="flex gap-10 items-center">
          <Container className="flex items-center gap-2">
            {navItems.map((item, key) => (
              <PortalNavItem item={item} key={key} />
            ))}
          </Container>
        </Container>

        <Container className="flex items-center gap-5">
          <NotificationIcon className="text-primary" size={24} />
          <Container as="button" type="button" onClick={toggleTheme} className="cursor-pointer">
            {theme === "light" ? (
              <DarkModeIcon className="text-primary" size={24} />
            ) : (
              <LightModeIcon className="text-primary" size={24} />
            )}
          </Container>
          <Container className="flex items-center gap-2">
            <Container className="w-8 h-8 rounded-full bg-brand-tertiary-bg-bold flex items-center justify-center">
              <UserIcon size={16} className="text-inverted" />
            </Container>
            <ChevronDownIcon className="text-secondary cursor-pointer" size={18} />
          </Container>
        </Container>
      </Container>
    </PortalWrapper>
  );
};
