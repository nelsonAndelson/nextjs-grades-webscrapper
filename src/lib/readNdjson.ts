// Reads a newline-delimited JSON (NDJSON) response as it streams in and calls
// onEvent for each complete line.
export async function readNdjson<T>(response: Response, onEvent: (event: T) => void) {
  if (!response.ok || !response.body) {
    throw new Error(`Request failed (${response.status})`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // a network chunk can end mid-line; keep the rest
    for (const line of lines) {
      if (line.trim()) onEvent(JSON.parse(line));
    }
  }
}
