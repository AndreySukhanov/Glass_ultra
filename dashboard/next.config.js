/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Allow Electron to load Next.js pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001',
}

module.exports = nextConfig
