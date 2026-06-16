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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col">
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
