/** @type {import('next').NextConfig} */

// Use an environment variable to control static export
// Set NEXT_STATIC_EXPORT=true for builds, leave unset for dev
const enableStaticExport = process.env.NEXT_STATIC_EXPORT === 'true' || 
                          process.env.NEXT_PHASE === 'phase-production-build';

const nextConfig = {
  // Only enable static export when explicitly enabled or during builds
  // This prevents routes-manifest.json errors in dev mode
  ...(enableStaticExport ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "almrapi.smarttechnica.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  trailingSlash: true,
  // Only set distDir when static export is enabled
  ...(enableStaticExport ? { distDir: 'out' } : {}),
  // Disable streaming for static export to ensure content is in HTML
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Performance optimizations
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  // Bundle analyzer (uncomment to analyze)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
