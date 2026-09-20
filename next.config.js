/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Older links (and anything cached) that point at a meeting path still land on the app.
  async redirects() {
    return [
      { source: '/meeting', destination: '/?app=1', permanent: false },
      { source: '/app', destination: '/?app=1', permanent: false },
    ];
  },
};
module.exports = nextConfig;
