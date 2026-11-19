import type { Browser } from "puppeteer-core";

// On Vercel/AWS Lambda use the slim serverless Chromium; locally use the
// Chrome that the full `puppeteer` package downloads.
export async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    // @sparticuz/chromium ships the "headless shell" build of Chrome.
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }

  const puppeteer = (await import("puppeteer")).default;
  return (await puppeteer.launch({ headless: true })) as unknown as Browser;
}
