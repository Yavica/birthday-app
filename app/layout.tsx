import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Birthday Surprise for You 🎁",
  description: "Happy Birthday! I made something special just for you. Tap to open!",
  openGraph: {
    title: "A Birthday Surprise for You 🎁",
    description: "Happy Birthday! Tap to open your gift.",
    images: ['/photo1.jpg'], // This uses your first memory as the link preview image!
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased bg-[#FFF0F5]`}
      >
        {children}
      </body>
    </html>
  );
}