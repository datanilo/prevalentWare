import { NextResponse } from "next/server";

export async function GET() {
  const auth0LogoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL || "http://localhost:3000")}`;
  return NextResponse.redirect(auth0LogoutUrl);
}
