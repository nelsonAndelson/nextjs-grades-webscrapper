"use client";

import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import LiveBrowser from "./LiveBrowser";
import type { ScrapeEvent } from "@/app/api/scrape/route";
import { useDispatch } from "react-redux";
import { setStudentProfile } from "@/redux/slices/studentProfileSlice";
import { useState } from "react";

const formSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

export default function StudentForm() {
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  const handleEvent = (event: ScrapeEvent) => {
    if (event.type === "frame") setFrame(event.data);
    else if (event.type === "url") setUrl(event.url);
    else if (event.type === "step") setSteps((prev) => [...prev, event.text]);
    else if (event.type === "error") setError(event.message);
    else if (event.type === "result") {
      dispatch(setStudentProfile(event.profile as any));
      form.reset();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSteps([]);
    setFrame(null);
    setUrl("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.getValues()),
      });
      if (!response.ok || !response.body) {
        throw new Error(`Request failed (${response.status})`);
      }

      // Read the NDJSON stream: each complete line is one event.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // keep any half-received line
        for (const line of lines) {
          if (line.trim()) handleEvent(JSON.parse(line));
        }
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Student Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Student Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button disabled={loading}>
            {loading ? "Scraping portal..." : "Fetch Grades"}
          </Button>
        </form>
      </Form>
      <LiveBrowser frame={frame} url={url} steps={steps} running={loading} />
    </div>
  );
}
