import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnership Program | Infoway Data Solutions",
  description: "Join the Infoway Partnership Program. Order internet, software, and support packages. Grow your business or community with reliable connectivity.",
};

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
