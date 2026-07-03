import { GuestGuard } from "@/shared/providers/guest-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}
