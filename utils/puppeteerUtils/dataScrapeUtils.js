import { moveTo, pause } from "./puppeteerUtils";

// Reads every course on the gradebook page and returns { "Course": "88%" }.
// Hovers and highlights each row first so the live viewer can follow along.
/**
 * @param {(text: string) => void} [onStep]
 * @returns {Promise<Record<string, string>>}
 */
export async function collectGrades(page, onStep = () => {}) {
  await page.waitForSelector("#main-inner");
  /** @type {Record<string, string>} */
  const grades = {};

  for (const course of await page.$$("div.gradebook-course")) {
    await moveTo(page, course);

    const row = await course.evaluate((el) => {
      el.style.outline = "2px solid #3b82f6";
      el.style.background = "#eff6ff";
      const title = el.querySelector(".gradebook-course-title");
      const grade = el.querySelector(
        ".summary-course .course-grade-value .rounded-grade"
      );
      return title && grade
        ? { title: title.textContent, grade: grade.textContent }
        : null;
    });

    if (row) {
      const name = row.title.trim().split(":")[0];
      grades[name] = Math.round(parseFloat(row.grade)) + "%";
      onStep(`Read ${name}: ${grades[name]}`);
    }
    await pause(300);
  }

  return grades;
}
