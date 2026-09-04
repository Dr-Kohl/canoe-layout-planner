import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES === 'true' ? '/cardboard-boat-float-lab' : undefined,
};

export default nextConfig;
