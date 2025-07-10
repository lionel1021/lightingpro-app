import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gradual migration: Enable checks but allow some flexibility
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'], // Only check src directory
  },
  typescript: {
    // TODO: Set to false after fixing all type errors
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  compress: true,
}

export default bundleAnalyzer(withNextIntl(nextConfig))