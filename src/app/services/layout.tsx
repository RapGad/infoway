import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internet & Custom Software Services",
  description: "Explore Infoway's high-speed rural internet, community hotspot networks, and tailored software solutions across Ghana.",
  openGraph: {
    title: "Internet & Custom Software Services | Infoway Data Solutions",
    description: "Reliable rural internet, hotspot connectivity, and bespoke software development in Ghana.",
    url: "https://infoway.com.gh/services",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
