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
        {/* Critical CSS inline for instant rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html,body{margin:0;padding:0;background:#000;color:#fff;font-family:system-ui,-apple-system,sans-serif}
            *{box-sizing:border-box}
            .min-h-screen{min-height:100vh}
            .bg-black{background-color:#000}
            .text-white{color:#fff}
            .flex{display:flex}
            .items-center{align-items:center}
            .justify-center{justify-content:center}
            .text-center{text-align:center}
            .animate-spin{animation:spin 1s linear infinite}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            .rounded-full{border-radius:9999px}
            .border-2{border-width:2px}
            .border-blue-400{border-color:#60a5fa}
            .w-12{width:3rem}
            .h-12{height:3rem}
            .mx-auto{margin-left:auto;margin-right:auto}
            .mb-4{margin-bottom:1rem}
            .text-4xl{font-size:2.25rem;line-height:2.5rem}
            .font-bold{font-weight:700}
            .bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
            .from-blue-400{--tw-gradient-from:#60a5fa;--tw-gradient-to:rgb(96 165 250 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
            .via-purple-400{--tw-gradient-to:rgb(196 181 253 / 0);--tw-gradient-stops:var(--tw-gradient-from),#c4b5fd,var(--tw-gradient-to)}
            .to-pink-400{--tw-gradient-to:#f472b6}
            .bg-clip-text{background-clip:text}
            .text-transparent{color:transparent}
          `
        }} />
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