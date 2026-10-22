import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SupportWidget } from "@/components/layout/SupportWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Infoway Data Solutions",
    default: "Infoway Data Solutions | Fast Internet & Custom Software",
  },
  description: "Infoway Data Solutions provides reliable, high-speed internet and bespoke software development for communities and businesses nationwide.",
  keywords: ["Infoway", "Infoway Data Solutions", "Internet Provider", "Software Development", "Ghana"],
  metadataBase: new URL('https://infowaydatasolutions.com'),
  openGraph: {
    title: "Infoway Data Solutions | Nationwide Digital Provider",
    description: "Reliable connectivity and software solutions tailored for Ghana.",
    url: "https://infowaydatasolutions.com",
    siteName: "Infoway Data Solutions",
    locale: "en_GH",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Infoway Data Solutions",
  "url": "https://infowaydatasolutions.com",
  "logo": "https://infowaydatasolutions.com/logo-clean.png",
  "image": "https://infowaydatasolutions.com/logo-clean.png",
  "description": "Infoway Data Solutions provides reliable high-speed internet and bespoke software development nationwide across Ghana.",
  "telephone": "+233506706787",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Tech Hub, Central Market",
    "addressLocality": "Duayaw Nkwanta",
    "addressRegion": "Ahafo",
    "addressCountry": "GH"
  },
  "priceRange": "GH₵",
  "sameAs": [
    "https://wa.me/233506706787"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <SupportWidget />
      </body>
    </html>
  );
}
