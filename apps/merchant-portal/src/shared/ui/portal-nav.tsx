"use client";
import { Container, Text, Button } from "@subgrid/ui";
import {
  DarkModeIcon,
  LightModeIcon,
  NotificationIcon,
  WalletIcon,
  PlaceholderIcon,
  LegalIcon,
  UserIcon,
  ThemeIcon,
  ChevronDownIcon,
  LogoutIcon,
  CopyIcon,
} from "@subgrid/ui/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";
import { logout } from "@/features/auth/services/auth.service";
import { NavItemType } from "../types/shared.types";

const navItems: NavItemType[] = [
  { title: "Dashboard", link: "/dashboard", icon: <PlaceholderIcon size={16} className="text-inverted" />, inActiveIcon: <PlaceholderIcon size={16} className="text-secondary" />, slug: "dashboard" },
  { title: "Plans", link: "/plans", icon: <LegalIcon size={16} className="text-inverted" />, inActiveIcon: <LegalIcon size={16} className="text-secondary" />, slug: "plans" },
  { title: "Customers", link: "/customers", icon: <UserIcon size={16} className="text-inverted" />, inActiveIcon: <UserIcon size={16} className="text-secondary" />, slug: "customers" },
  { title: "Transactions", link: "/transactions", icon: <WalletIcon size={16} className="text-inverted" />, inActiveIcon: <WalletIcon size={16} className="text-secondary" />, slug: "transactions" },
  { title: "API Keys", link: "/api-keys", icon: <CopyIcon size={16} className="text-inverted" />, inActiveIcon: <CopyIcon size={16} className="text-secondary" />, slug: "api-keys" },
  { title: "Settings", link: "/settings", icon: <ThemeIcon size={16} className="text-inverted" />, inActiveIcon: <ThemeIcon size={16} className="text-secondary" />, slug: "settings" },
];

export const PortalNav = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const initials = user?.userInfo?.businessName
    ? user.userInfo.businessName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "SG";

  return (
    <Container className="sticky top-0 z-50 bg-surface border-b border-border">
      <Container className="max-w-[1400px] mx-auto px-6">
        <Container className="flex items-center justify-between h-[60px]">
          <Container className="flex items-center gap-8">
            <Container className="flex items-center gap-2">
              <Container className="w-7 h-7 rounded-lg bg-brand-bg-bold flex items-center justify-center">
                <WalletIcon size={14} className="text-inverted" />
              </Container>
              <Text variant="h5" className="text-primary font-semibold tracking-tight">
                SubGrid
              </Text>
            </Container>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.link);
                return (
                  <Container
                    key={item.slug}
                    onClick={() => router.push(item.link)}
                    as="button"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-brand-bg-bold text-inverted"
                        : "text-secondary hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {isActive ? item.icon : item.inActiveIcon}
                    <span>{item.title}</span>
                  </Container>
                );
              })}
            </nav>
          </Container>

          <Container className="flex items-center gap-2">
            <Container
              as="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer"
            >
              {theme === "light" ? <DarkModeIcon size={18} /> : <LightModeIcon size={18} />}
            </Container>

            <Container
              as="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer relative"
            >
              <NotificationIcon size={18} />
              <Container className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger-bg-bold" />
            </Container>

            <Container className="w-px h-5 bg-border mx-1" />

            <Container className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <Container className="w-7 h-7 rounded-full bg-brand-bg-bold flex items-center justify-center">
                <Text variant="bodyXSmall" className="text-inverted font-semibold text-[10px]">
                  {initials}
                </Text>
              </Container>
              <Container className="hidden sm:block">
                <Text variant="bodyXSmall" className="text-primary font-medium">
                  {user?.userInfo?.businessName ?? "Merchant"}
                </Text>
              </Container>
              <ChevronDownIcon size={14} className="text-secondary" />
            </Container>

            <Container
              as="button"
              onClick={async () => {
                try {
                  const refreshToken = user?.refresh_token;
                  if (refreshToken) await logout(refreshToken);
                } catch {
                  // proceed with local logout regardless
                } finally {
                  clearAuth();
                  router.replace("/login");
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-danger-text-icons hover:bg-danger-bg-light transition-colors cursor-pointer"
            >
              <LogoutIcon size={18} />
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
