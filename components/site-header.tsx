"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export function SiteHeader() {
  const pathname = usePathname();

  // Hide marketing header on dashboard routes
  if (pathname?.startsWith("/dashboard")) return null;

  return <Header />;
}


