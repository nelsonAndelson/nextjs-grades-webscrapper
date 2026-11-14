import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../../utils/mockPortal/mockPortal";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/mock-portal/login", request.url),
    303
  );
  response.cookies.delete({ name: SESSION_COOKIE, path: "/mock-portal" });
  return response;
}
