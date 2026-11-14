"use client";

import { useEffect, useRef } from "react";

type LiveBrowserProps = {
  frame: string | null; // latest base64 JPEG from the headless browser
  url: string;
  steps: string[];
  running: boolean;
};

export default function LiveBrowser({ frame, url, steps, running }: LiveBrowserProps) {
  const logRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [steps]);

  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 truncate rounded bg-white px-3 py-1 text-xs text-gray-600">
          {url || "about:blank"}
        </div>
        {running && (
          <span className="flex items-center gap-1 text-xs font-medium text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" /> LIVE
          </span>
        )}
      </div>

      <div className="relative aspect-[4/3] bg-slate-50">
        {frame ? (
          // eslint-disable-next-line @next/next/no-img-element -- frames are raw data URLs
          <img
            src={`data:image/jpeg;base64,${frame}`}
            alt="Live view of the headless browser"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
            Press <b className="mx-1">Fetch Grades</b> to watch the bot log in and scrape the
            gradebook live.
          </div>
        )}
      </div>

      <ol
        ref={logRef}
        className="h-28 overflow-y-auto border-t border-gray-200 bg-gray-950 px-3 py-2 font-mono text-xs text-green-400"
      >
        {steps.length === 0 ? (
          <li className="text-gray-500">$ waiting…</li>
        ) : (
          steps.map((step, i) => <li key={i}>$ {step}</li>)
        )}
      </ol>
    </div>
  );
}
