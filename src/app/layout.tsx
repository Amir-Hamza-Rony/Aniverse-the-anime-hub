import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AniVerse - Your Universe of Anime",
  description: "Stream and download authorized anime. Premium anime streaming platform.",
  openGraph: {
    siteName: "AniVerse",
    title: "AniVerse - Your Universe of Anime",
    description: "Stream and download authorized anime.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#080B12] text-white min-h-screen font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
