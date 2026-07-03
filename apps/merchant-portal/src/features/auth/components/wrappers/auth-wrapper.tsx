import { ReactNode } from "react";
import { AuthImage } from "../auth-image";
import { Container, Text } from "@subgrid/ui";
import { WalletIcon } from "@subgrid/ui/icons";

export const AuthWrapper = ({
  children,
  authLabel,
  subAuthLabel,
}: {
  children: ReactNode;
  authLabel: string;
  subAuthLabel?: string;
}) => {
  return (
    <Container className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%]">
      <Container className="hidden lg:block sticky top-0 h-screen">
        <AuthImage />
      </Container>

      <Container className="h-screen overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden bg-background">
        <Container className="min-h-full flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-14">
          <Container className="w-full max-w-md mx-auto">
            <Container className="flex items-center gap-2 mb-10 lg:hidden">
              <Container className="w-8 h-8 rounded-lg bg-brand-bg-bold flex items-center justify-center">
                <WalletIcon size={16} className="text-inverted" />
              </Container>
              <Text variant="h5" className="text-primary font-semibold">
                SubGrid
              </Text>
            </Container>

            {authLabel ? (
              <Container className="mb-8">
                <Text variant="h3" className="text-primary leading-tight">
                  {authLabel}
                </Text>
                {subAuthLabel && (
                  <Text variant="bodySmall" className="text-secondary mt-2">
                    {subAuthLabel}
                  </Text>
                )}
              </Container>
            ) : null}

            <Container>{children}</Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
