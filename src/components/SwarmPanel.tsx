"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import LiveBrowser from "./LiveBrowser";
import { readNdjson } from "@/lib/readNdjson";
import type { SwarmEvent } from "@/app/api/swarm/route";
import { StudentProfileType } from "@/types/types";

type Worker = {
  email: string;
  frame: string | null;
  url: string;
  steps: string[];
  profile?: StudentProfileType;
  error?: string;
  ms?: number;
};

const seconds = (ms: number) => (ms / 1000).toFixed(1) + "s";

export default function SwarmPanel() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<{ ms: number; sequentialMs: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Frames arrive ~30x/second across 5 workers; batch them into one render per animation frame.
  const pendingFrames = useRef<Map<number, string>>(new Map());
  const frameScheduled = useRef(false);

  const updateWorker = (index: number, change: (w: Worker) => Partial<Worker>) =>
    setWorkers((prev) => prev.map((w, i) => (i === index ? { ...w, ...change(w) } : w)));

  const flushFrames = () => {
    frameScheduled.current = false;
    const frames = new Map(pendingFrames.current);
    pendingFrames.current.clear();
    setWorkers((prev) =>
      prev.map((w, i) => (frames.has(i) ? { ...w, frame: frames.get(i)! } : w))
    );
  };

  const handleEvent = (event: SwarmEvent) => {
    switch (event.type) {
      case "start":
        setWorkers(event.students.map((email) => ({ email, frame: null, url: "", steps: [] })));
        break;
      case "frame":
        pendingFrames.current.set(event.worker, event.data);
        if (!frameScheduled.current) {
          frameScheduled.current = true;
          requestAnimationFrame(flushFrames);
        }
        break;
      case "url":
        updateWorker(event.worker, () => ({ url: event.url }));
        break;
      case "step":
        updateWorker(event.worker, (w) => ({ steps: [...w.steps, event.text] }));
        break;
      case "result":
        updateWorker(event.worker, () => ({ profile: event.profile }));
        break;
      case "error":
        updateWorker(event.worker, () => ({ error: event.message }));
        break;
      case "finished":
        updateWorker(event.worker, () => ({ ms: event.ms }));
        break;
      case "done":
        setSummary({ ms: event.ms, sequentialMs: event.sequentialMs });
        break;
    }
  };

  const launch = async () => {
    setRunning(true);
    setSummary(null);
    setError(null);
    setWorkers([]);
    try {
      await readNdjson(await fetch("/api/swarm", { method: "POST" }), handleEvent);
    } catch (err) {
      console.error("Swarm failed:", err);
      setError("The swarm failed to start. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const finished = workers.filter((w) => w.profile);

  return (
    <section className="flex w-full max-w-[1400px] flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Button size="lg" onClick={launch} disabled={running}>
          {running ? "Swarm running…" : "🚀 Launch swarm (5 students)"}
        </Button>
        <p className="max-w-xl text-sm text-muted-foreground">
          One headless Chrome, five isolated windows, five students scraped at the same time.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {workers.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {workers.map((w, i) => (
            <div key={w.email} className="flex flex-col gap-1">
              <p className="truncate text-xs font-medium text-gray-700">
                Bot {i + 1} · {w.email}
              </p>
              <LiveBrowser
                compact
                frame={w.frame}
                url={w.url}
                steps={w.steps}
                running={running && w.ms === undefined}
                badge={
                  w.profile
                    ? { text: `✓ ${w.profile.gradesAverage}% avg`, tone: "success" }
                    : w.error
                    ? { text: "✕ failed", tone: "error" }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      )}

      {summary && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-800">
          <b>
            {finished.length} students in {seconds(summary.ms)}
          </b>{" "}
          · one-by-one would take ~{seconds(summary.sequentialMs)} (
          {(summary.sequentialMs / summary.ms).toFixed(1)}× faster)
        </p>
      )}

      {finished.length > 0 && (
        <div className="w-full max-w-5xl overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-left text-sm text-gray-900">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Scraped grades</th>
                <th className="px-3 py-2">Average</th>
                <th className="px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {finished.map((w) => (
                <tr key={w.email} className="border-t">
                  <td className="px-3 py-2">
                    {w.profile!.firstName} {w.profile!.lastName}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(w.profile!.gradesObject).map(([course, grade]) => (
                        <span key={course} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                          {course}: <b>{grade}</b>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-semibold">{w.profile!.gradesAverage}%</td>
                  <td className="px-3 py-2">{w.ms ? seconds(w.ms) : "…"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t px-3 py-2 text-right">
            <Link href="/student-profiles" className="text-sm text-gray-900 underline">
              View all students →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
