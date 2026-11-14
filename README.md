# Grades Web Scraper

A Next.js app that logs into a student portal with a headless browser (Puppeteer), scrapes the gradebook, and saves each student's grades to Postgres. Saved profiles can be searched, filtered and sorted in a data table.

**Live demo:** _add your Vercel URL here_

## Try it

1. Open the live demo.
2. Sign in with the test credentials shown on the page (`jordan.rivera@demo-school.edu` / `demo1234`). Any `first.last@demo-school.edu` email works and gets its own set of grades.
3. The server launches headless Chrome, logs into the demo school portal (`/mock-portal/login`), reads the grades, and stores them.
4. Click **View all students** to see every scraped profile.

The scraper was originally built against a real district's Clever → Schoology portal. The public demo targets a mock portal served by this same app, which uses the same gradebook markup, so no real student data is involved and the demo keeps working.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **Puppeteer**: full Chrome locally, `puppeteer-core` + `@sparticuz/chromium` on Vercel
- **Neon** serverless Postgres (scales to zero and wakes automatically on the next query)
- Redux Toolkit, TanStack Table, shadcn/ui, Tailwind, Zod + React Hook Form

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL from your Neon project
npm run db:setup             # creates the table and seed rows
npm run dev
```

## Deploy (Vercel)

1. Create a free Neon project and copy its pooled connection string.
2. Import the repo into Vercel and set the `DATABASE_URL` environment variable.
3. Run `npm run db:setup` once locally against that database.
4. Optional: set `PORTAL_URL` if the portal should be reached at a different URL than the incoming request host.
