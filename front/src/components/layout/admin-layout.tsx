"use client";

import { token } from "@/api/token";
import { GlobalContext } from "@/hooks/use-global-context";
import { useEffect, useState } from "react";

export type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

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
      {children}
    </GlobalContext.Provider>
  );
}
