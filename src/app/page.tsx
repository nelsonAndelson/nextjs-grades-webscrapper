"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";

import StudentForm from "@/components/StudentForm";
import TestCredentials from "@/components/TestCredentials";
import DisplayGrades from "@/components/DisplayGrades";
import SwarmPanel from "@/components/SwarmPanel";
import WelcomText from "@/components/ui/WelcomeText";

const MODES = [
  { id: "single", label: "Single scraper" },
  { id: "swarm", label: "Swarm mode ⚡" },
] as const;

export default function Page() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("single");

  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col gap-6 items-center justify-center p-4 py-12 lg:p-24">
        <WelcomText />

        <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === m.id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "single" ? (
          <>
            <TestCredentials />
            <StudentForm />
            <DisplayGrades />
          </>
        ) : (
          <SwarmPanel />
        )}
      </main>
    </Provider>
  );
}
