import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
  themeColor: "#0d0d12",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://onebitgame.netlify.app'),
  title: "Tiny Coder | Algorithms for Beginners",
  description: "Teach a robot to think. One logic chip at a time.",
  openGraph: {
    title: "Tiny Coder | Algorithms for Beginners",
    description: "Build logic sequences to guide a robot through cyber challenges.",
    images: [
      {
        url: "/og-image.jpg",
        secureUrl: "https://onebitgame.netlify.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tiny Coder Game Thumbnail",
      },
    ],
    type: "website",
    siteName: "Tiny Coder",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiny Coder",
    description: "Build logic sequences to guide a robot through cyber challenges.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
