"use server";
import puppeteer, { Page } from "puppeteer";
import {
  performLogin,
  clickSchoology,
} from "../utils/puppeteerUtils/puppeteerActionUtils";
import { collectGrades } from "../utils/puppeteerUtils/dataScrapeUtils";
import { addToDbAndReturnProfile } from "../utils/mongodbUtils/mongodbUtils";

//S25925ss

export async function run(email: string, password: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page: Page = await browser.newPage();
  const parts: string[] = email.split("@")[0].split(".");
  const firstName: string = parts[0];
  const lastName: string = parts[1];
  try {
    await performLogin(page, email, password);
    await clickSchoology(page);
    const collectedGrades = await collectGrades(page);

    const res = await addToDbAndReturnProfile(
      collectedGrades, // TODO: fix type
      firstName,
      lastName,
      email
    );

    return res;
    // return collectedGrades;
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // await browser.close();
  }
}
