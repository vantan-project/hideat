"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { LogoIcon } from "../shared/icons/logo-icon";
import { usePathname } from "next/navigation";
import { House, Pin, History} from "lucide-react";
import Link from "next/link";

export type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";
  const isKeepPage = pathname === "/keep";
  const isHistoryPage = pathname === "/history";

  return (
    <HeroUIProvider>
      <ToastProvider />
      {!isAdminPage && (
        <>
          <div className="h-20 w-full fixed z-30 rounded-b-2xl shadow-2xl bg-primary flex items-center pl-4">
            <LogoIcon className="w-32 h-auto text-white" />
          </div>
          <div className="h-20" />
        </>
      )}
      {children}
      {!isAdminPage && (
        <div className="fixed bottom-0 left-0 z-50 w-screen grid grid-cols-3 bg-primary px-10 py-2 rounded-tl-4xl rounded-tr-4xl">
          <Link
            href="/"
            className={`py-2 text-white rounded-full ${isHomePage ? "bg-white" : ""}`}
          >
            <div className="flex flex-col items-center justify-center">
              <House className={`w-5 h-5 ${isHomePage ? "text-primary" : "text-white"}`} />
              <span className={`text-xs mt-1 ${isHomePage ? "text-primary" : "text-white"}`}>ホーム</span>
            </div>
          </Link>
          <Link
            href="/keep"
            className={`py-2 text-white rounded-full ${isKeepPage ? "bg-white" : ""}`}
          >
            <div className="flex flex-col items-center justify-center">
              <Pin className={`w-5 h-5 ${isKeepPage ? "text-primary" : "text-white"}`} />
              <span className={`text-xs mt-1 ${isKeepPage ? "text-primary" : "text-white"}`}>キープ</span>
            </div>
          </Link>
          <Link
            href="/history"
            className={`py-2 text-white rounded-full ${isHistoryPage ? "bg-white" : ""}`}
          >
            <div className="flex flex-col items-center justify-center">
              <History className={`w-5 h-5 ${isHistoryPage ? "text-primary" : "text-white"}`} />
              <span className={`text-xs mt-1 ${isHistoryPage ? "text-primary" : "text-white"}`}>履歴</span>
            </div>
          </Link>
        </div>
      )}
    </HeroUIProvider>
  );
}
