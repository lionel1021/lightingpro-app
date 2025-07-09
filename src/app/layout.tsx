import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
import { PWAManager } from "@/components/PWAManager";
import { SEOHead } from "@/components/SEOHead";
import ClientOnly from "@/components/ClientOnly";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LightingPro - AI-Powered Lighting Recommendations",
  description: "Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands like Philips, Xiaomi, and IKEA.",
  keywords: "lighting, smart home, LED lights, pendant lights, table lamps, ceiling lights, recommendations, AI, home improvement",
  openGraph: {
    title: "LightingPro - AI-Powered Lighting Recommendations",
    description: "Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from premium brands.",
    type: "website",
    locale: "en_US",
    siteName: "LightingPro",
  },
  twitter: {
    card: "summary_large_image",
    site: "@lightingpro",
    creator: "@lightingpro",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LightingPro",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <PageErrorBoundary title="LightingPro">
              {children}
              <ClientOnly>
                <PWAManager />
              </ClientOnly>
            </PageErrorBoundary>
          </ToastProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
