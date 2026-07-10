"use client";

import { ClientHeader } from "@/components/client-header";
import { ScrollToTopButton } from "@/components/scroll-to-top";
import { ClientFooter } from "@/components/client-footer";
import { PageTransitionProvider } from "@/components/page-transition";
import { SmoothScroll } from "@/components/cliente/home/gm/smooth-scroll";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTransitionProvider>
      <SmoothScroll />
      <div className="min-h-screen bg-white">
        <ClientHeader />
        <main>{children}</main>
        <ClientFooter />
        <ScrollToTopButton />
      </div>
    </PageTransitionProvider>
  );
}
