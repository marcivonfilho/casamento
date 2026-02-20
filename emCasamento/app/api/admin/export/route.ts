import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });

  const rows = guests.map((g) => ({
    Nome: g.name,
    Codigo: g.code,
    Confirmado: g.confirmed ? "Sim" : "Não",
    Pessoas: g.qty,
    Mensagem: g.message ?? "",
    CriadoEm: g.createdAt ? new Date(g.createdAt).toISOString() : "",
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Convidados");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="convidados.xlsx"`,
    },
  });
}