import type { Browser } from "puppeteer-core";

// On Vercel/AWS Lambda use the slim serverless Chromium; locally use the
// Chrome that the full `puppeteer` package downloads.
export async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const puppeteer = (await import("puppeteer")).default;
  return (await puppeteer.launch({ headless: "new" })) as unknown as Browser;
}
