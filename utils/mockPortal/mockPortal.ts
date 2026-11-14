// Shared config + fake data for the demo "school portal" that the scraper logs into.
// Any email on DEMO_DOMAIN works with DEMO_PASSWORD; grades are generated from the
// email so each student gets their own stable set of grades.

export const DEMO_DOMAIN = "demo-school.edu";
export const DEMO_PASSWORD = "demo1234";
export const DEMO_EMAIL = `jordan.rivera@${DEMO_DOMAIN}`;
export const SESSION_COOKIE = "mock_portal_session";

const COURSES = [
  "English III",
  "Algebra II - Honors",
  "US History",
  "Chemistry",
  "Health Education",
  "Spanish II",
  "Computer Science Principles",
  "Senior Seminar",
];

export function isValidLogin(email: string, password: string): boolean {
  const pattern = new RegExp(
    `^[a-z]+\\.[a-z]+@${DEMO_DOMAIN.replace(".", "\\.")}$`,
    "i"
  );
  return pattern.test(email.trim()) && password === DEMO_PASSWORD;
}

// Small deterministic PRNG (mulberry32) seeded from the email.
function seededRandom(seedText: string) {
  let seed = 0;
  for (const ch of seedText.toLowerCase()) {
    seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  }
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getMockGrades(email: string) {
  const rand = seededRandom(email);
  const courses = [...COURSES].sort(() => rand() - 0.5).slice(0, 5);
  return courses.map((title) => ({
    title,
    section: `Section ${100 + Math.floor(rand() * 900)}`,
    grade: (65 + rand() * 35).toFixed(2), // e.g. "87.43"
  }));
}
