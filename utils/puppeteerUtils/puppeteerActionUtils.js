import { moveAndClick, pause, typeInInput } from "./puppeteerUtils";

// Logs into the demo school portal (src/app/mock-portal). On success the portal
// redirects to the grades page; on failure it shows #login-error.
// onStep(text) reports progress to the live viewer.
/** @param {(text: string) => void} [onStep] */
export async function performLogin(page, portalUrl, email, password, onStep = () => {}) {
  onStep("Opening the school portal…");
  await page.goto(`${portalUrl}/mock-portal/login`, {
    waitUntil: "domcontentloaded",
  });

  onStep("Typing the student email…");
  await typeInInput(page, "#email", email);

  onStep("Typing the password…");
  await typeInInput(page, "#password", password);

  onStep("Clicking Sign in…");
  await moveAndClick(page, "#sign-in");

  // Wait for whichever page we land on: the gradebook or the login error.
  // (More robust than waitForNavigation across the redirect chain.)
  const landed = await page.waitForSelector("#main-inner, #login-error", {
    timeout: 30000,
  });
  const isError = await landed.evaluate((el) => el.id === "login-error");
  if (isError) {
    await pause(800); // keep the error on screen for the viewer
    throw new Error("Invalid student email or password.");
  }
  onStep("Signed in. Gradebook loaded.");
}
