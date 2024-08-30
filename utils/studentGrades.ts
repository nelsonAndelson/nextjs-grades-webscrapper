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
  return total / grades.length;
}

export { formatGrades, getGradesAverage };
