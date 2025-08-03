"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
