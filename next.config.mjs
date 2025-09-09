import createMDX from '@next/mdx'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better React development
  reactStrictMode: true,
  
  // Page extensions including MDX
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'chiportal.com',
      'assets.chiportal.com',
      'lh3.googleusercontent.com', // Google OAuth avatars
      'avatars.githubusercontent.com', // GitHub avatars
      'cloudflare-ipfs.com', // Cloudflare R2
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  
  // Redirects for old routes or shortcuts
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/signin',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/register',
        permanent: true,
      },
    ]
  },
  
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  
  // Webpack configuration for aliases and optimizations
  webpack: (config, { dev, isServer }) => {
    // Add custom aliases if needed
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    }
    
    return config
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize CSS
    optimizeCss: true,
  },
  
  // TypeScript configuration
typescript: {
  ignoreBuildErrors: true,  // Always ignore for now
},

eslint: {
  ignoreDuringBuilds: true,  // Always ignore for now
},
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // Generate build ID for better caching
  generateBuildId: async () => {
    return process.env.BUILD_ID || `build-${Date.now()}`
  },
  
  // PWA configuration (manifest will be in public/)
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ]
  },
}

// MDX Configuration
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

export default withMDX(nextConfig)
