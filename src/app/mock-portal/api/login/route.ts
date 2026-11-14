import { NextRequest, NextResponse } from "next/server";
import {
  isValidLogin,
  SESSION_COOKIE,
} from "../../../../../utils/mockPortal/mockPortal";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!isValidLogin(email, password)) {
    return NextResponse.redirect(
      new URL("/mock-portal/login?error=1", request.url),
      303
    );
  }

  const response = NextResponse.redirect(
    new URL("/mock-portal/grades", request.url),
    303
  );
  response.cookies.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/mock-portal",
    maxAge: 60 * 30,
  });
  return response;
}
