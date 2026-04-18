/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
      { protocol: 'https', hostname: 'www.figma.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-east-1.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 's3.us-east-1.amazonaws.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
