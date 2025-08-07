"use client";

import { token } from "@/api/token";
import { GlobalContext } from "@/hooks/use-global-context";
import { useEffect, useState } from "react";
import { LogoIcon } from "../shared/icons/logo-icon";
import { usePathname } from "next/navigation";
import Link from "next/link"; 1
import path from "path";

export type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const pathname = usePathname();
  const isLoginPage = pathname == "/admin/login";
  const isSignUpPage = pathname == "/admin/sign-up";

  useEffect(() => {
    const tokenApi = async () => {
      const res = await token();

      if (res.success) {
        setIsLoggedIn(true);
        setRestaurantId(res.restaurantId);
      }
    };

    tokenApi();
  });

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        restaurantId,
        setRestaurantId,
      }}
    >

      {/* サイドナビバー */}
      {(!isLoggedIn && !isSignUpPage) && (
        <aside className="w-56 bg-primary flex flex-col items-center py-6 fixed top-0 left-0 h-screen z-30">
          <LogoIcon className="w-40 h-auto text-white mb-9" />
          <nav className="w-full flex flex-col gap-0 mt-2">
            <Link href="/admin/restaurant" className="mx-2 border-white border-y">
              <div className="w-full text-center py-5.5 text-white font-bold text-base bg-transparent hover:opacity-50 transition cursor-pointer">
                店舗情報
              </div>
            </Link>
            <Link href="/admin/user" className="mx-2 border-white border-b">
              <div className="w-full text-center py-5.5 text-white font-bold text-base bg-transparent hover:opacity-50 transition cursor-pointer">
                ユーザーリスト
              </div>
            </Link>
          </nav>
        </aside>
      )}
      <div className="pl-56">
        {children}
      </div>
    </GlobalContext.Provider>
  );
}
