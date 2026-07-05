"use client";
import { Container, Text } from "@subgrid/ui";
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
  DrawerOutIcon,
} from "@subgrid/ui/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";
import { logout } from "@/features/auth/services/auth.service";

const navItems = [
  { title: "Dashboard", link: "/dashboard", icon: <PlaceholderIcon size={18} />, slug: "dashboard" },
  { title: "Products", link: "/products", icon: <LegalIcon size={18} />, slug: "products" },
  { title: "Customers", link: "/customers", icon: <UserIcon size={18} />, slug: "customers" },
  { title: "Transactions", link: "/transactions", icon: <WalletIcon size={18} />, slug: "transactions" },
  { title: "API Keys", link: "/api-keys", icon: <CopyIcon size={18} />, slug: "api-keys" },
  { title: "Webhooks", link: "/webhooks", icon: <DrawerOutIcon size={18} />, slug: "webhooks" },
  { title: "Settings", link: "/settings", icon: <ThemeIcon size={18} />, slug: "settings" },
];

export const PortalNav = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const initials = user?.user
    ? `${user.user.firstName?.[0] ?? ""}${user.user.lastName?.[0] ?? ""}`.toUpperCase()
    : "SG";

  const handleLogout = async () => {
    try {
      if (user?.refreshToken) await logout(user.refreshToken);
    } catch {
      // proceed regardless
    } finally {
      clearAuth();
      router.replace("/login");
    }
  };

  return (
    <>
      {/* ── Desktop top nav ──────────────────────────────── */}
      <Container className="sticky top-0 z-50 bg-surface border-b border-border">
        <Container className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <Container className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <Container className="flex items-center gap-6">
              <Container className="flex items-center gap-2 shrink-0">
                <Container className="w-7 h-7 rounded-lg bg-brand-bg-bold flex items-center justify-center">
                  <WalletIcon size={14} className="text-inverted" />
                </Container>
                <Text variant="h5" className="text-primary font-semibold tracking-tight">
                  SubGrid
                </Text>
              </Container>

              {/* Desktop nav items */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <button
                      key={item.slug}
                      onClick={() => router.push(item.link)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-brand-bg-bold text-white"
                          : "text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      <span className={isActive ? "text-white" : "text-[var(--secondary)]"}>
                        {item.icon}
                      </span>
                      {item.title}
                    </button>
                  );
                })}
              </nav>
            </Container>

            {/* Right controls */}
            <Container className="flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors"
              >
                {theme === "light" ? <DarkModeIcon size={17} /> : <LightModeIcon size={17} />}
              </button>

              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--muted)] transition-colors">
                <NotificationIcon size={17} />
              </button>

              <Container className="w-px h-5 bg-border mx-1 hidden sm:block" />

              <Container className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer">
                <Container className="w-7 h-7 rounded-full bg-brand-bg-bold flex items-center justify-center shrink-0">
                  <Text variant="bodyXSmall" className="text-inverted font-semibold text-[10px]">
                    {initials}
                  </Text>
                </Container>
                <Text variant="bodyXSmall" className="text-primary font-medium hidden lg:block">
                  {user?.user ? `${user.user.firstName} ${user.user.lastName}` : "Merchant"}
                </Text>
                <ChevronDownIcon size={13} className="text-[var(--secondary)]" />
              </Container>

              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--secondary)] hover:text-[var(--danger-text-icons)] hover:bg-[var(--danger-bg-light)] transition-colors"
              >
                <LogoutIcon size={17} />
              </button>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* ── Mobile bottom tab bar ────────────────────────── */}
      <Container className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
        <Container className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.link);
            return (
              <button
                key={item.slug}
                onClick={() => router.push(item.link)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[48px]"
              >
                <span className={isActive ? "text-[var(--brand-text-icons)]" : "text-[var(--secondary)]"}>
                  {item.icon}
                </span>
                <Text
                  variant="bodyXSmall"
                  className={`text-[10px] font-medium ${isActive ? "text-brand-text-icons" : "text-secondary"}`}
                >
                  {item.title}
                </Text>
              </button>
            );
          })}
        </Container>
      </Container>
    </>
  );
};
