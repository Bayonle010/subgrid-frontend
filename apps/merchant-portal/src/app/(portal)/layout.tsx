import { AuthGuard } from "@/shared/providers/auth-guard";
import { PortalNav } from "@/shared/ui/portal-nav";
import { Container } from "@subgrid/ui";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Container className="min-h-screen bg-background flex flex-col">
        <PortalNav />
        <Container as="main" className="flex-1">
          {children}
        </Container>
      </Container>
    </AuthGuard>
  );
}
