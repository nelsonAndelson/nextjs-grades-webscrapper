import { describe, it, expect } from "vitest";
import { getGradesAverage } from "./studentGradesUtils";

describe("getGradesAverage", () => {
  it("averages percentage strings", () => {
    // Arrange
    const grades = { Chemistry: "80%", "US History": "90%" };
    // Act
    const average = getGradesAverage(grades);
    // Assert
    expect(average).toBe(85);
  });

  it("rounds to one decimal place", () => {
    expect(getGradesAverage({ A: "90%", B: "85%", C: "88%" })).toBe(87.7);
  });

  it("returns 0 when there are no grades", () => {
    expect(getGradesAverage({})).toBe(0);
  });
});
