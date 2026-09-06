import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Offline AI Code Review | Private & Secure",
  description: "Review your code offline with AI. No data leaves your machine.",
  keywords: ["code review", "AI", "offline", "privacy", "developer tools"],
  authors: [{ name: "Your Name" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Offline AI Code Review",
    description: "Privacy-first code review platform",
    type: "website",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#080B0B" },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-[#080B0B] text-[#E7E5E4] antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen relative overflow-hidden">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0D1212",
                color: "#E7E5E4",
                border: "1px solid rgba(94, 234, 212, 0.24)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
