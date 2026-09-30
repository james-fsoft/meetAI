/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Older links (and anything cached) that point at a meeting path still land on the app.
  async redirects() {
    return [
      { source: '/meeting', destination: '/?app=1', permanent: false },
      { source: '/app', destination: '/?app=1', permanent: false },
      // the landing moved from /concept to the site root
      { source: '/concept', destination: '/vi', permanent: false },
      { source: '/concept/en', destination: '/', permanent: false },
      { source: '/concept/ko', destination: '/ko', permanent: false },
      // the conference landing moved next to the other landings
      { source: '/concept/conference', destination: '/vi/conference', permanent: false },
      { source: '/concept/en/conference', destination: '/conference', permanent: false },
      { source: '/concept/ko/conference', destination: '/ko/conference', permanent: false },
      { source: '/en/conference', destination: '/conference', permanent: false },
    ];
  },
};
module.exports = nextConfig;
