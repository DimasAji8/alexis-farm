import { NextResponse } from "next/server";

import { auth } from "@/app/api/(features)/auth/auth";

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);

  if (!isLoggedIn) {
    const loginUrl = new URL("/client/auth/login", req.nextUrl.origin);
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;

    if (callbackUrl && callbackUrl !== "/") {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/client/dashboard/:path*"],
};
