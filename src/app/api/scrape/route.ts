import { NextRequest } from "next/server";
import * as zod from "zod";
import { performLogin } from "../../../../utils/puppeteerUtils/puppeteerActionUtils";
import { collectGrades } from "../../../../utils/puppeteerUtils/dataScrapeUtils";
import { injectCursor } from "../../../../utils/puppeteerUtils/puppeteerUtils";
import { launchBrowser } from "../../../../utils/puppeteerUtils/launchBrowser";
import { startScreencast } from "../../../../utils/puppeteerUtils/screencast";
import { addToDbAndReturnProfile } from "../../../../utils/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds, for Vercel

export type ScrapeEvent =
  | { type: "step"; text: string }
  | { type: "frame"; data: string }
  | { type: "url"; url: string }
  | { type: "result"; profile: Awaited<ReturnType<typeof addToDbAndReturnProfile>> }
  | { type: "error"; message: string };

const bodySchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(1),
});

// The scraper targets the demo portal served by this same app, unless
// PORTAL_URL points somewhere else.
function getPortalUrl(request: NextRequest) {
  if (process.env.PORTAL_URL) return process.env.PORTAL_URL.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Streams the scrape as newline-separated JSON (NDJSON): progress steps,
// live JPEG frames of the headless browser, then a final result or error.
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const [firstName = "", lastName = ""] = email.split("@")[0].split(".");
  const portalUrl = getPortalUrl(request);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: ScrapeEvent) => {
        if (!closed) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };
      const onStep = (text: string) => send({ type: "step", text });

      onStep("Launching headless Chrome…");
      const browser = await launchBrowser();
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 });
        await injectCursor(page);
        page.on("framenavigated", (frame) => {
          if (frame === page.mainFrame()) send({ type: "url", url: frame.url() });
        });
        const stopScreencast = await startScreencast(page, (data) =>
          send({ type: "frame", data })
        );

        try {
          await performLogin(page, portalUrl, email, password, onStep);
          const grades = await collectGrades(page, onStep);
          if (Object.keys(grades).length === 0) {
            throw new Error("No grades found on the portal.");
          }
          onStep("Saving to the database…");
          const profile = await addToDbAndReturnProfile(grades, firstName, lastName, email);
          onStep("Done!");
          send({ type: "result", profile });
        } finally {
          await stopScreencast();
        }
      } catch (error) {
        console.error("Scrape failed:", error);
        const message = error instanceof Error ? error.message : "Scrape failed.";
        send({ type: "error", message });
      } finally {
        await browser.close();
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
