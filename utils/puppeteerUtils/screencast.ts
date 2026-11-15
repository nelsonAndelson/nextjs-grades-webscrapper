import type { Page } from "puppeteer-core";

type ScreencastOptions = {
  quality?: number; // JPEG quality 0-100
  maxWidth?: number;
  maxHeight?: number;
  fps?: number; // cap frames sent per second (extra frames are dropped)
};

// Streams a JPEG of the page every time it repaints, using Chrome's DevTools
// Protocol (CDP). Returns a function that stops the screencast.
export async function startScreencast(
  page: Page,
  onFrame: (base64Jpeg: string) => void,
  { quality = 60, maxWidth = 800, maxHeight = 600, fps }: ScreencastOptions = {}
) {
  const session = await page.target().createCDPSession();
  const minGap = fps ? 1000 / fps : 0;
  let lastSent = 0;

  // The screencast captures the whole window, not just the page viewport, so a
  // window larger than the viewport shows up as empty bands. Size the window to
  // the viewport, then correct by however much the window's own frame takes.
  const viewport = page.viewport() ?? { width: maxWidth, height: maxHeight };
  const { windowId } = await session.send("Browser.getWindowForTarget");
  const bounds = { width: viewport.width, height: viewport.height };
  await session.send("Browser.setWindowBounds", { windowId, bounds });
  let fitAttempts = 0;

  session.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
    const dw = viewport.width - Math.round(metadata.deviceWidth);
    const dh = viewport.height - Math.round(metadata.deviceHeight);
    const misfit = dw !== 0 || dh !== 0;
    if (misfit && fitAttempts < 3) {
      fitAttempts++;
      bounds.width += dw;
      bounds.height += dh;
      await session.send("Browser.setWindowBounds", { windowId, bounds }).catch(() => {});
    }

    const now = Date.now();
    // Skip misfit frames while resizing, but never stall the stream if it can't fit.
    if ((!misfit || fitAttempts >= 3) && now - lastSent >= minGap) {
      lastSent = now;
      onFrame(data);
    }
    // Chrome waits for this ack before sending the next frame, so always ack.
    await session.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });

  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality,
    maxWidth,
    maxHeight,
  });

  return async () => {
    await session.send("Page.stopScreencast").catch(() => {});
    await session.detach().catch(() => {});
  };
}
