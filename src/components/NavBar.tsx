"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Scraper" },
  { href: "/student-profiles", label: "All students" },
  { href: "/mock-portal/login", label: "Demo portal" },
];

export default function NavBar() {
  const pathname = usePathname();
  // The mock portal plays a separate school site inside the bot's window, so no app nav there.
  if (pathname.startsWith("/mock-portal")) return null;

  return (
    <nav className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold text-gray-900">
          🎓 Grades Scraper
        </Link>
        <div className="flex gap-1 text-sm">
          {LINKS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
