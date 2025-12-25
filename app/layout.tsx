import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";
import "./globals.css";

const redditSans = Reddit_Sans({
  variable: "--font-reddit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Tracking",
  description: "Mood Tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redditSans.variable} antialiased flex flex-col h-screen px-4 py-8 bg-linear-to-b from-[#f5f5ff] from-73% to-[#e0e0ff]`}
      >
        {children}
      </body>
    </html>
  );
}
