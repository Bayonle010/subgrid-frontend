import type { Metadata } from "next";
import { googleSansFlex } from "@subgrid/ui/fonts";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SubGrid — Merchant Portal",
  description: "Manage your subscription plans, billing, and customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSansFlex.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
