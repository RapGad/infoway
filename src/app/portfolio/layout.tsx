import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software & Technology Portfolio",
  description: "Browse our software development portfolio, network deployments, and management systems built for African businesses and communities.",
  openGraph: {
    title: "Software & Technology Portfolio | Infoway Data Solutions",
    description: "Explore our real-world tech systems, apps, and digital infrastructure across Ghana.",
    url: "https://infoway.com.gh/portfolio",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
