import {
  findElementByXPath,
  waitForSelector,
  typeInInput,
  submitForm,
} from "./puppeteerUtils";
const LOGIN_URL = "https://clever.com/in/cmsd";

export async function performLogin(page, email, password) {
  await page.goto(LOGIN_URL);
  const path = 'a[aria-label*="Microsoft Entra"]';

  const loginBtn = await page.$('a[aria-label*="Microsoft Entra"]');
  if (loginBtn) {
    await loginBtn.click();

    await typeEmailAndClickNext(page, email);
    await typePasswordAndSubmit(page, password);
  } else {
    console.error(`Element with path = ${path} not found`);
  }
}

async function typeEmailAndClickNext(page, email) {
  await typeInInput(page, "#i0116", email);
  const emailNextBtn = await waitForSelector(page, "#idSIButton9");
  await emailNextBtn.click();
}

async function typePasswordAndSubmit(page, password) {
  try {
    await typeInInput(page, "#i0118", password);
    await page.waitForTimeout(2000);
    await submitForm(page);
    await page.waitForTimeout(1000);
    const noBtn = await waitForSelector(page, "#idBtn_Back");
    noBtn && (await noBtn.click());
  } catch (error) {
    console.error(error);
  }
}

export async function clickSchoology(page) {
  const hrefToFind =
    "https://clever.com/oauth/authorize?channel=clever-portal&client_id=7bc88bc05b84adc6a9fa&confirmed=true&district_id=55b7bcd43ca5be0100000ee6&redirect_uri=https%3A%2F%2Fsamlidp.clever.com%2Fsaml-schoology%2Foauth&response_type=code";

  try {
    const link = await page.waitForSelector(`a[href="${hrefToFind}"]`, {
      timeout: 5000,
    });

    await page.evaluate((link) => {
      link.removeAttribute("target");
    }, link);

    await link.click();

    // Wait for navigation to complete to the new URL
    await page.waitForNavigation();

    // Now, navigate to the desired route
    await page.goto("https://clevelandmetro.schoology.com/grades/grades");
  } catch (error) {
    console.error("Element not found within the specified timeout.");
  }
}
