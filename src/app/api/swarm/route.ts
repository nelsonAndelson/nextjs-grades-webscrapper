import { NextRequest } from "next/server";
import { launchBrowser } from "../../../../utils/puppeteerUtils/launchBrowser";
import {
  getPortalUrl,
  ndjsonResponse,
  scrapeStudent,
  ScrapeEvent,
} from "../../../../utils/scrapeStudent";
import { DEMO_DOMAIN, DEMO_PASSWORD } from "../../../../utils/mockPortal/mockPortal";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds, for Vercel

const SWARM_SIZE = 5;

export type SwarmEvent =
  | ({ worker: number } & ScrapeEvent)
  | { type: "start"; students: string[] }
  | { type: "finished"; worker: number; ms: number }
  | { type: "done"; ms: number; sequentialMs: number };

const FIRST = ["riley", "avery", "jordan", "casey", "morgan", "skyler", "devon", "quinn", "harper", "rowan"];
const LAST = ["chen", "patel", "garcia", "okafor", "nguyen", "silva", "kim", "brooks", "haddad", "novak"];

function pickStudents(count: number) {
  const shuffle = <T,>(list: T[]) => [...list].sort(() => Math.random() - 0.5);
  const firsts = shuffle(FIRST);
  const lasts = shuffle(LAST);
  return Array.from({ length: count }, (_, i) => `${firsts[i]}.${lasts[i]}@${DEMO_DOMAIN}`);
}

// Scrapes 5 students in parallel: one Chrome, one incognito window per
// student, all streaming live frames tagged with their worker number.
export async function POST(request: NextRequest) {
  const portalUrl = getPortalUrl(request);
  const students = pickStudents(SWARM_SIZE);

  return ndjsonResponse<SwarmEvent>(async (send) => {
    const started = Date.now();
    send({ type: "start", students });
    const browser = await launchBrowser();

    try {
      const durations = await Promise.all(
        students.map(async (email, worker) => {
          const workerStart = Date.now();
          try {
            await scrapeStudent(
              browser,
              {
                email,
                password: DEMO_PASSWORD,
                portalUrl,
                // 5 streams at once: smaller, lower-quality, capped frames.
                // A narrow page makes the portal fill more of each small tile.
                viewport: { width: 480, height: 360 },
                screencast: { quality: 50, maxWidth: 480, maxHeight: 360, fps: 6 },
              },
              (event) => send({ worker, ...event })
            );
          } catch (error) {
            console.error(`Swarm worker ${worker} failed:`, error);
          }
          const ms = Date.now() - workerStart;
          send({ type: "finished", worker, ms });
          return ms;
        })
      );

      send({
        type: "done",
        ms: Date.now() - started,
        sequentialMs: durations.reduce((sum, ms) => sum + ms, 0),
      });
    } finally {
      await browser.close();
    }
  });
}
