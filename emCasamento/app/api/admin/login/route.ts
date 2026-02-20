import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const password = body.password;

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "casamento2026";

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_auth", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}