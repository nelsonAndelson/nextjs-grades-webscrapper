import { NextRequest } from "next/server";
import * as zod from "zod";
import { launchBrowser } from "../../../../utils/puppeteerUtils/launchBrowser";
import {
  getPortalUrl,
  ndjsonResponse,
  scrapeStudent,
  ScrapeEvent,
} from "../../../../utils/scrapeStudent";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds, for Vercel

const bodySchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(1),
});

// Streams one scrape: progress steps, live JPEG frames, then result or error.
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }
  const portalUrl = getPortalUrl(request);

  return ndjsonResponse<ScrapeEvent>(async (send) => {
    send({ type: "step", text: "Launching headless Chrome…" });
    const browser = await launchBrowser();
    try {
      await scrapeStudent(browser, { ...parsed.data, portalUrl }, send);
    } catch (error) {
      console.error("Scrape failed:", error); // already streamed as an error event
    } finally {
      await browser.close();
    }
  });
}
