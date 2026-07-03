import { PortalNav } from "@/shared/ui/portal-nav";
import { PortalSubNav } from "@/shared/ui/portal-subnav";
import { Container } from "@subgrid/ui";
import React, { ReactNode } from "react";
import { AuthGuard } from "@/shared/providers/auth-guard";
import { PortalWrapper } from "@/shared/ui/portal-wrapper";

function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <Container className="min-h-screen h-screen bg-surface flex flex-col">
        <PortalNav />
        <Container className="flex-1 overflow-auto bg-surface-2 pt-4">
          <PortalWrapper>{children}</PortalWrapper>
        </Container>
      </Container>
    </AuthGuard>
  );
}

export default PortalLayout;
