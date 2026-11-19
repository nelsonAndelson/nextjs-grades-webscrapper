/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep the headless-browser packages out of the server bundle.
    serverComponentsExternalPackages: [
      "puppeteer",
      "puppeteer-core",
      "@sparticuz/chromium",
    ],
    // Chromium's compressed binaries are read from disk at runtime, not
    // require()d, so Vercel's file tracing misses them unless listed here.
    outputFileTracingIncludes: {
      "/api/scrape": ["./node_modules/@sparticuz/chromium/bin/**"],
      "/api/swarm": ["./node_modules/@sparticuz/chromium/bin/**"],
    },
  },
};

module.exports = nextConfig;
