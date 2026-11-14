/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep the headless-browser packages out of the server bundle.
    serverComponentsExternalPackages: [
      "puppeteer",
      "puppeteer-core",
      "@sparticuz/chromium",
    ],
  },
};

module.exports = nextConfig;
