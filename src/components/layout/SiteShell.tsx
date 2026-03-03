"use client";

import { usePathname } from "next/navigation";
import DesignerSidebar from "@/components/landing-v2/DesignerSidebar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {isHome && <DesignerSidebar />}
      {children}
    </>
  );
}
