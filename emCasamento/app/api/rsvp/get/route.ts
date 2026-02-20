import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "code missing" }, { status: 400 });
  }

  const guest = await prisma.guest.findUnique({
    where: { code },
  });

  if (!guest) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  return Response.json({
    name: guest.name,
    qty: guest.qty,
  });
}