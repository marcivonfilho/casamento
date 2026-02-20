import { prisma } from "@/lib/prisma";

function randomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const qty = Number(body.qty || 1);
    const message = body.msg || null;
    const code = body.code || null;

    if (!name) {
      return Response.json({ error: "Nome obrigatório" }, { status: 400 });
    }

    // 🔥 LINK PÚBLICO → cria sempre novo
    if (code === "PUBLIC") {
      await prisma.guest.create({
        data: {
          name,
          qty,
          message,
          confirmed: true,
          code: randomCode(), // <- resolve
        },
      });

      return Response.json({ ok: true });
    }

    // 🔥 CÓDIGO INDIVIDUAL → atualiza se existir
    if (code) {
      const existing = await prisma.guest.findUnique({
        where: { code },
      });

      if (existing) {
        await prisma.guest.update({
          where: { code },
          data: {
            name,
            qty,
            message,
            confirmed: true,
          },
        });

        return Response.json({ ok: true });
      }
    }

    // 🔥 fallback → cria novo
    await prisma.guest.create({
      data: {
        name,
        qty,
        message,
        confirmed: true,
        code: randomCode(),
      },
    });

    return Response.json({ ok: true });

  } catch (err) {
    console.log("ERRO RSVP:", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}