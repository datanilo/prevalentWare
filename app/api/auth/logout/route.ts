import { NextResponse } from "next/server";

export async function GET() {
  const auth0LogoutUrl = `${process.env.AUTH_AUTH0_ISSUER}/v2/logout?client_id=${process.env.AUTH_AUTH0_ID}&returnTo=${encodeURIComponent(process.env.APP_BASE_URL || "http://localhost:3000")}`;
  return NextResponse.redirect(auth0LogoutUrl);
}
