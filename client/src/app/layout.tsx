import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Offline AI Code Review Platform",
  description:
    "Privacy-first, offline AI-powered code review platform. Your code never leaves your machine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-background text-white antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Global toast notifications - used across the whole app */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e1e2e",
              color: "#fff",
              border: "1px solid #2a2a3c",
            },
          }}
        />
      </body>
    </html>
  );
}


