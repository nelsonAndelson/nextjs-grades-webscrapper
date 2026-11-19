import type { Browser } from "puppeteer-core";
import { performLogin } from "./puppeteerUtils/puppeteerActionUtils";
import { collectGrades } from "./puppeteerUtils/dataScrapeUtils";
import { injectCursor } from "./puppeteerUtils/puppeteerUtils";
import { startScreencast } from "./puppeteerUtils/screencast";
import { addToDbAndReturnProfile } from "./db";
import { StudentProfileType } from "@/types/types";

// Events streamed to the browser as NDJSON (one JSON object per line).
export type ScrapeEvent =
  | { type: "step"; text: string }
  | { type: "frame"; data: string }
  | { type: "url"; url: string }
  | { type: "result"; profile: StudentProfileType }
  | { type: "error"; message: string };

type ScrapeOptions = {
  email: string;
  password: string;
  portalUrl: string;
  screencast?: Parameters<typeof startScreencast>[2];
  viewport?: { width: number; height: number };
};

// Scrapes one student in its own incognito context. A separate context gives
// each scraper its own window (so background scrapers still paint frames) and
// its own cookies (so parallel logins don't overwrite each other).
export async function scrapeStudent(
  browser: Browser,
  { email, password, portalUrl, screencast, viewport = { width: 800, height: 600 } }: ScrapeOptions,
  emit: (event: ScrapeEvent) => void
): Promise<StudentProfileType> {
  const [firstName = "", lastName = ""] = email.split("@")[0].split(".");
  const onStep = (text: string) => emit({ type: "step", text });

  const context = await browser.createIncognitoBrowserContext();
  try {
    const page = await context.newPage();
    await page.setViewport(viewport);
    await injectCursor(page);
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) emit({ type: "url", url: frame.url() });
    });
    const stopScreencast = await startScreencast(
      page,
      (data) => emit({ type: "frame", data }),
      screencast
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
      emit({ type: "result", profile });
      return profile;
    } finally {
      await stopScreencast();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed.";
    emit({ type: "error", message });
    throw error;
  } finally {
    await context.close().catch(() => {});
  }
}

// The scraper targets the demo portal served by this same app, unless
// PORTAL_URL points somewhere else.
export function getPortalUrl(request: Request) {
  if (process.env.PORTAL_URL) return process.env.PORTAL_URL.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Wraps an async job in an NDJSON streaming Response. `send` writes one event
// per line; the stream closes when the job finishes.
export function ndjsonResponse<T>(job: (send: (event: T) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: T) => {
        if (!closed) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };
      try {
        await job(send);
      } catch (error) {
        // e.g. Chrome failed to launch: log it and tell the client instead of closing silently.
        console.error("Streaming job failed:", error);
        const message = error instanceof Error ? error.message : "Something went wrong.";
        send({ type: "error", message } as T);
      } finally {
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
