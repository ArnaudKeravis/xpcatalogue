/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // All product images are stored locally under `public/images/`.
    // No remote image hosts are allowed on purpose.
    remotePatterns: [],
  },
};

export default nextConfig;
