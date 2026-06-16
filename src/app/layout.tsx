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
    template: "%s | Infoway - Ahafo's Premier Digital Provider",
    default: "Infoway | Fast Internet & Custom Software in Ahafo",
  },
  description: "Infoway provides reliable, high-speed rural internet and bespoke software development for communities and businesses in Duayaw Nkwanta and the Ahafo Region.",
  metadataBase: new URL('https://infoway.com.gh'), // Placeholder domain
  openGraph: {
    title: "Infoway | Bridging the Digital Divide in Ahafo",
    description: "Reliable rural connectivity and software solutions tailored for Ghana.",
    url: "https://infoway.com.gh",
    siteName: "Infoway",
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
