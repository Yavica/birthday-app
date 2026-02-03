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
  description: "Jamie, I made this for you. Tap to open!",
  openGraph: {
    title: "A Birthday Surprise for You 🎁",
    description: "Tap to open your gift!",
    images: [{
      url: '/photo1.jpg', // Or your custom preview image
      width: 1200,
      height: 630,
    }],
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