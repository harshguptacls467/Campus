import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Campus Copilot — Your Campus. One Intelligence.",
  description:
    "AI-powered campus intelligence platform that transforms scattered college information into personalized, actionable decisions.",
  keywords: [
    "Campus Copilot",
    "AI Campus Intelligence",
    "Student Copilot",
    "College AI",
    "Placement Intelligence",
    "Bunk-o-Meter",
    "Panic Mode Study",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#FBFBFA] text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
