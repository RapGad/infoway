import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Story & Mission",
  description: "Learn how Infoway was founded to bridge the digital divide in rural Ghana with resilient community fibre, hotspots, and local software.",
  openGraph: {
    title: "About Our Story & Mission | Infoway Data Solutions",
    description: "Building digital futures nationwide across Ghana. Learn about our team and mission.",
    url: "https://infoway.com.gh/about",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
