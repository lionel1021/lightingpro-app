// Removed next-intl plugin - using simple i18n implementation

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  typescript: {
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
  // Force complete rebuild - no multilingual support
  generateBuildId: async () => {
    return 'english-only-' + Date.now();
  },
}

export default nextConfig;