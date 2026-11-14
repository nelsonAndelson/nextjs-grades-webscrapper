import type { Page } from "puppeteer-core";

// Streams a JPEG of the page every time it repaints, using Chrome's DevTools
// Protocol (CDP). Returns a function that stops the screencast.
export async function startScreencast(
  page: Page,
  onFrame: (base64Jpeg: string) => void
) {
  const session = await page.target().createCDPSession();

  session.on("Page.screencastFrame", async ({ data, sessionId }) => {
    onFrame(data);
    // Chrome waits for this ack before sending the next frame.
    await session.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });

  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality: 60,
    maxWidth: 800,
    maxHeight: 600,
  });

  return async () => {
    await session.send("Page.stopScreencast").catch(() => {});
    await session.detach().catch(() => {});
  };
}
