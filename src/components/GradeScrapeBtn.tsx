"use server";
import { Button } from "./ui/button";
import puppeteer, { Page } from "puppeteer";

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page: Page = await browser.newPage();

  try {
    page.goto("https://clever.com/in/cmsd");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

export const GradeScrapeBtn = () => {
  return (
    <Button 
      className="w-full"
      onClick={() => {
        console.log("hello");
      }}
    >
      Fetch Grades
    </Button>
  );
};
