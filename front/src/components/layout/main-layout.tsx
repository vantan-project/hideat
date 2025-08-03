"use client";

import { HeroUIProvider } from "@heroui/react";

export type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
