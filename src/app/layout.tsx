import type { Metadata } from "next";
import {
  Inter,
  Poppins,
  Sora,
  Cairo,
} from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/context/app-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "EduPulse AI — Your AI Study Companion",
  description:
    "An AI-powered educational platform that supports students academically and emotionally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${sora.variable} ${cairo.variable} font-sans`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
