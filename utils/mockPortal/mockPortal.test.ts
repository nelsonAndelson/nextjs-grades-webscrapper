import { describe, it, expect } from "vitest";
import { isValidLogin, getMockGrades, DEMO_PASSWORD } from "./mockPortal";

describe("isValidLogin", () => {
  it("accepts first.last@demo-school.edu with the demo password", () => {
    expect(isValidLogin("riley.chen@demo-school.edu", DEMO_PASSWORD)).toBe(true);
  });

  it("ignores letter case and surrounding spaces in the email", () => {
    expect(isValidLogin("  Riley.Chen@Demo-School.edu ", DEMO_PASSWORD)).toBe(true);
  });

  it.each([
    ["wrong password", "riley.chen@demo-school.edu", "nope"],
    ["wrong domain", "riley.chen@gmail.com", DEMO_PASSWORD],
    ["no dot in the name", "rileychen@demo-school.edu", DEMO_PASSWORD],
    ["empty email", "", DEMO_PASSWORD],
  ])("rejects %s", (_label, email, password) => {
    expect(isValidLogin(email, password)).toBe(false);
  });
});

describe("getMockGrades", () => {
  it("gives the same student the same grades every time", () => {
    const first = getMockGrades("riley.chen@demo-school.edu");
    const second = getMockGrades("riley.chen@demo-school.edu");
    expect(second).toEqual(first);
  });

  it("gives different students different grades", () => {
    expect(getMockGrades("riley.chen@demo-school.edu")).not.toEqual(
      getMockGrades("avery.patel@demo-school.edu")
    );
  });

  it("returns 5 unique courses with grades between 65 and 100", () => {
    const grades = getMockGrades("riley.chen@demo-school.edu");

    expect(grades).toHaveLength(5);
    expect(new Set(grades.map((g) => g.title)).size).toBe(5);
    for (const { grade } of grades) {
      expect(Number(grade)).toBeGreaterThanOrEqual(65);
      expect(Number(grade)).toBeLessThanOrEqual(100);
    }
  });
});
