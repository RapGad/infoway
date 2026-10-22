import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Infoway Partnership Program",
  description: "Manage orders and products for the Infoway Partnership Program.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
