/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['metaltecferragens.com.br'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
