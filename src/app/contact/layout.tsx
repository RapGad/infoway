import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & WhatsApp Support",
  description: "Get in touch with Infoway Data Solutions. Contact our support team via WhatsApp on 0506706787 or visit our local headquarters.",
  openGraph: {
    title: "Contact Us & WhatsApp Support | Infoway Data Solutions",
    description: "Get connected with fast internet and custom software solutions. Chat with us on WhatsApp: 0506706787.",
    url: "https://infowaydatasolutions.com/contact",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
