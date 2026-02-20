import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalGuests = guests.length;
  const confirmed = guests.filter(g => g.confirmed).length;
  const pending = totalGuests - confirmed;
  const people = guests.filter(g => g.confirmed).reduce((s, g) => s + (g.qty ?? 0), 0);

  return Response.json({
    guests,
    summary: { totalGuests, confirmed, pending, people },
  });
}