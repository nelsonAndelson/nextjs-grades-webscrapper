import { neon } from "@neondatabase/serverless";
import { StudentProfileType, GradesObjectType } from "@/types/types";
import { getGradesAverage } from "./studentGradesUtils";

// Neon's HTTP driver: no connection pool to manage, and the database wakes
// automatically on the first query after it scales to zero.
function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(process.env.DATABASE_URL);
}

type ProfileRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  grades: GradesObjectType;
  date_added: string | Date;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function toProfile(row: ProfileRow): StudentProfileType {
  return {
    _id: String(row.id),
    firstName: capitalize(row.first_name),
    lastName: capitalize(row.last_name),
    email: row.email,
    gradesObject: row.grades,
    dateAdded: new Date(row.date_added).toISOString(),
    gradesAverage: getGradesAverage(row.grades) || undefined,
  };
}

export async function addToDbAndReturnProfile(
  gradesObject: GradesObjectType,
  firstName: string,
  lastName: string,
  email: string
): Promise<StudentProfileType> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO student_profiles (first_name, last_name, email, grades, date_added)
    VALUES (${firstName}, ${lastName}, ${email}, ${JSON.stringify(gradesObject)}::jsonb, now())
    ON CONFLICT (email) DO UPDATE
      SET first_name = EXCLUDED.first_name,
          last_name  = EXCLUDED.last_name,
          grades     = EXCLUDED.grades,
          date_added = now()
    RETURNING *
  `) as ProfileRow[];
  return toProfile(rows[0]);
}

export async function getStudentProfiles(): Promise<StudentProfileType[]> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM student_profiles ORDER BY date_added DESC
    `) as ProfileRow[];
    return rows.map(toProfile);
  } catch (error) {
    console.error("Failed to load student profiles:", error);
    return [];
  }
}
