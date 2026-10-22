import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest News & Tech Blog",
  description: "Read the latest updates, internet deployment news, digital guides, and tech tips from the Infoway engineering team.",
  openGraph: {
    title: "Latest News & Tech Blog | Infoway Data Solutions",
    description: "Insights on rural internet, software engineering, and digital growth in Ghana.",
    url: "https://infoway.com.gh/blog",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
