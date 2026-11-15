import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

// Scraping runs a headless browser inside a server action; give it time on Vercel.
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Grades Scrapper",
  description: "Grades web scrapper for schoology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
