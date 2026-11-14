import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getMockGrades,
  SESSION_COOKIE,
} from "../../../../utils/mockPortal/mockPortal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demo School Portal – Grades" };

// Markup mirrors the class names of the Schoology gradebook the scraper was
// originally written for (gradebook-course, rounded-grade, ...).
export default function MockPortalGrades() {
  const email = cookies().get(SESSION_COOKIE)?.value;
  if (!email) redirect("/mock-portal/login");

  const courses = getMockGrades(email);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div id="main-inner" className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Grades</h1>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
          <form method="post" action="/mock-portal/api/logout">
            <button className="text-sm text-blue-600 hover:underline">Sign out</button>
          </form>
        </div>

        {courses.map((course) => (
          <div key={course.title} className="gradebook-course flex justify-between border-t py-3">
            <div className="gradebook-course-title font-medium">
              {course.title}: {course.section}
            </div>
            <div className="gradebook-course-grades">
              <div className="summary-course">
                <span className="course-grade-text mr-1 text-slate-500">Course Grade:</span>
                <span className="course-grade-value">
                  <span className="rounded-grade font-semibold">{course.grade}%</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
