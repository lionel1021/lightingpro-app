/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig;