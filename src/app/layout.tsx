import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: "LightingPro - AI-Powered Lighting Recommendations",
  description: "Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands like Philips, Xiaomi, and IKEA.",
  keywords: "lighting, smart home, LED lights, pendant lights, table lamps, ceiling lights, recommendations, AI, home improvement",
  authors: [{ name: "LightingPro Team" }],
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "LightingPro",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "LightingPro - AI-Powered Lighting Recommendations",
    description: "Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands.",
    siteName: "LightingPro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@lightingpro",
    creator: "@lightingpro",
    title: "LightingPro - AI-Powered Lighting Recommendations",
    description: "Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands.",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}