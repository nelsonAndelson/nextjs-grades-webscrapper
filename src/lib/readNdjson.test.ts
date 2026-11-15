import { describe, it, expect } from "vitest";
import { readNdjson } from "./readNdjson";

// Builds a fake streaming Response that delivers the text in the given chunks,
// like a slow network would.
function streamOf(chunks: string[]) {
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(body);
}

describe("readNdjson", () => {
  it("calls onEvent once per JSON line", async () => {
    const events: unknown[] = [];
    await readNdjson(streamOf(['{"n":1}\n{"n":2}\n']), (e) => events.push(e));
    expect(events).toEqual([{ n: 1 }, { n: 2 }]);
  });

  it("rebuilds a line that was split across network chunks", async () => {
    const events: unknown[] = [];
    await readNdjson(streamOf(['{"type":"st', 'ep","text":"hi"}\n']), (e) => events.push(e));
    expect(events).toEqual([{ type: "step", text: "hi" }]);
  });

  it("skips blank lines", async () => {
    const events: unknown[] = [];
    await readNdjson(streamOf(['{"n":1}\n\n\n']), (e) => events.push(e));
    expect(events).toEqual([{ n: 1 }]);
  });

  it("throws when the server responds with an error", async () => {
    const failed = new Response("boom", { status: 500 });
    await expect(readNdjson(failed, () => {})).rejects.toThrow("Request failed (500)");
  });
});
