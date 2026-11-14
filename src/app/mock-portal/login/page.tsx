import { DEMO_EMAIL, DEMO_PASSWORD } from "../../../../utils/mockPortal/mockPortal";

export const metadata = { title: "Demo School Portal – Sign in" };

export default function MockPortalLogin({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="text-xl font-semibold text-slate-900">Demo School Portal</h1>
        <p className="mb-6 text-sm text-slate-500">
          A fake student portal that the grades scraper logs into.
        </p>

        {searchParams.error && (
          <p id="login-error" className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">
            Incorrect email or password.
          </p>
        )}

        <form id="login-form" method="post" action="/mock-portal/api/login" className="flex flex-col gap-3">
          <label className="text-sm text-slate-700">
            Email
            <input id="email" name="email" type="email" required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
          </label>
          <label className="text-sm text-slate-700">
            Password
            <input id="password" name="password" type="password" required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
          </label>
          <button id="sign-in" type="submit"
            className="mt-2 rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Demo login: <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
          <br />
          Any <code>first.last@demo-school.edu</code> email works.
        </p>
      </div>
    </main>
  );
}
