import { AdminLayout } from "@/components/layout/admin-layout";

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
