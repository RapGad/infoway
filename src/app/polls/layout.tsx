import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Polls & Price Voting",
  description: "Have your say in Infoway's pricing, internet packages, and business tools. Vote in our live community polls and suggest new questions.",
  openGraph: {
    title: "Community Polls & Price Voting | Infoway Data Solutions",
    description: "Vote on pricing, packages, and new features for Infoway Hotspots and rural connectivity.",
    url: "https://infowaydatasolutions.com/polls",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function PollsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
