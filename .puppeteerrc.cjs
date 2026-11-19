// On Vercel the scraper uses @sparticuz/chromium, so skip Puppeteer's own
// Chrome download there (it is slow and breaks on newer Node versions).
module.exports = {
  skipDownload: Boolean(process.env.VERCEL),
};
