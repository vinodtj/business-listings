/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Remove standalone output - not compatible with Netlify Next.js plugin
  // output: 'standalone', // Disabled for Netlify compatibility
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig

