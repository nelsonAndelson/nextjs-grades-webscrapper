import { parse } from "path";

function formatGrades(grades: any): string {
  return Object.entries(grades)
    .map(([subject, grade]) => `${subject.replace(" - Honors", "")} ${grade}`)
    .join(" ");
}

function getGradesAverage(gradesObject: { [key: string]: string }): number {
  const grades = Object.values(gradesObject).map((grade) =>
    parseFloat(grade.replace("%", ""))
  );
  const total = grades.reduce((acc, grade) => acc + grade, 0);
  const average = total / grades.length;
  return parseFloat(average.toFixed(1));
}

export { formatGrades, getGradesAverage };
