"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { LogoIcon } from "../shared/icons/logo-icon";
import { usePathname } from "next/navigation";

export type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      {!isAdminPage && (
        <>
          <div className="h-20 w-full fixed z-30 rounded-b-2xl shadow-2xl bg-primary flex items-center pl-4">
            <LogoIcon className="w-32 h-auto text-white" />
          </div>
          <div className="h-20" />
        </>
      )}
      {children}
    </HeroUIProvider>
  );
}
