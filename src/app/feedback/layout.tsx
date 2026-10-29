import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Feedback | Student & Community Voices | Infoway",
  description: "Share your thoughts, experiences, and suggestions to help improve Infoway campus Wi-Fi, hotspot vouchers, and services.",
  openGraph: {
    title: "Send Feedback | Infoway Data Solutions",
    description: "Share your thoughts, report issues, or suggest new features to help us build better connectivity.",
    url: "https://infowaydatasolutions.com/feedback",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
