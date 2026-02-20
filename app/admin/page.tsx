"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Guest = {
  id: string;
  name: string;
  code: string;
  confirmed: boolean;
  qty: number;
  message?: string | null;
  createdAt?: string;
};

type AdminResponse = {
  guests: Guest[];
  summary: {
    totalGuests: number;
    confirmed: number;
    pending: number;
    people: number;
  };
};

export default function AdminPage() {
  const [data, setData] = useState<AdminResponse | null>(null);
  const [q, setQ] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/admin", { cache: "no-store" });
    const json = (await res.json()) as AdminResponse;
    setData(json);
  }

  // 🔥 Tempo real via SSE (push)
  useEffect(() => {
    load();

    const es = new EventSource("/api/realtime");
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "rsvp:update") load();
      } catch {}
    };
    es.onerror = () => {
      // fallback: se SSE falhar, mantém atualizando por polling
    };

    const fallback = setInterval(load, 8000);
    return () => {
      es.close();
      clearInterval(fallback);
    };
  }, []);

  const guests = data?.guests ?? [];
  const summary = data?.summary ?? { totalGuests: 0, confirmed: 0, pending: 0, people: 0 };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return guests;
    return guests.filter((g) => {
      return (
        g.name.toLowerCase().includes(term) ||
        g.code.toLowerCase().includes(term) ||
        (g.message ?? "").toLowerCase().includes(term)
      );
    });
  }, [guests, q]);

  const barData = useMemo(() => {
  return {
    labels: ["Confirmados", "Pendentes"],
    datasets: [
      {
        label: "Convidados",
        data: [summary.confirmed, summary.pending],
        backgroundColor: [
          "rgba(34,197,94,0.85)",   // verde
          "rgba(245,158,11,0.85)",  // dourado
        ],
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };
}, [summary]);

  const doughnutData = useMemo(() => {
  return {
    labels: ["Confirmados", "Pendentes"],
    datasets: [
      {
        data: [summary.confirmed, summary.pending],
        backgroundColor: [
          "#22c55e",
          "#f59e0b",
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };
}, [summary]);

  function copyLink(code: string) {
    navigator.clipboard.writeText(`${window.location.origin}/rsvp/${code}`);
    // toast simples
    alert("Link RSVP copiado!");
  }

  async function exportExcel() {
    const res = await fetch("/api/admin/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convidados.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando painel...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif tracking-wide">Emilly & Marcivon</h1>
            <p className="text-white/40 mt-1">Painel de confirmações (ao vivo)</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportExcel}
              className="bg-white text-black px-4 py-2 rounded-xl text-sm hover:scale-[1.02] transition"
            >
              Exportar Excel
            </button>
            <button
              onClick={logout}
              className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition"
            >
              Sair
            </button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <Metric title="Convidados" value={summary.totalGuests} />
          <Metric title="Confirmados" value={summary.confirmed} />
          <Metric title="Pendentes" value={summary.pending} />
          <Metric title="Pessoas confirmadas" value={summary.people} />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="md:col-span-2 panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/70">Confirmações</h2>
              <span className="text-xs text-white/35">atualiza automaticamente</span>
            </div>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                    backgroundColor: "#111",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderWidth: 1,
                    titleColor: "#fff",
                    bodyColor: "#ddd",
                    },
                },
                scales: {
                    x: {
                    ticks: { color: "rgba(255,255,255,0.7)" },
                    grid: { color: "rgba(255,255,255,0.06)" },
                    },
                    y: {
                    ticks: { color: "rgba(255,255,255,0.7)" },
                    grid: { color: "rgba(255,255,255,0.06)" },
                    },
                },
                }}
            />
          </div>

          <div className="panel p-6">
            <h2 className="text-white/70 mb-4">Distribuição</h2>
            <Doughnut
              data={doughnutData}
              options={{
                plugins: { legend: { labels: { color: "rgba(255,255,255,0.65)" } } },
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="panel overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between gap-4">
            <h2 className="text-white/75">Convidados</h2>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, código ou mensagem..."
              className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/25"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/45">
                <tr className="bg-white/5">
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Código</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Qtd</th>
                  <th className="p-4 text-left">Mensagem</th>
                  <th className="p-4 text-left">Link</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="p-4">{g.name}</td>
                    <td className="p-4">{g.code}</td>
                    <td className="p-4">
                      {g.confirmed ? (
                        <span className="pill pill-ok">Confirmado</span>
                      ) : (
                        <span className="pill pill-wait">Pendente</span>
                      )}
                    </td>
                    <td className="p-4">{g.qty}</td>
                    <td className="p-4 text-white/60 max-w-[320px] truncate">
                      {g.message ?? ""}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => copyLink(g.code)}
                        className="text-white/65 hover:text-white underline-offset-4 hover:underline"
                      >
                        copiar RSVP
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="p-6 text-white/40" colSpan={6}>
                      Nenhum convidado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* estilos rápidos */}
        <style jsx>{`
          .panel {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            backdrop-filter: blur(18px);
          }
          .pill {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            border: 1px solid rgba(255, 255, 255, 0.12);
          }
          .pill-ok {
            color: rgba(74, 222, 128, 0.95);
            background: rgba(74, 222, 128, 0.1);
          }
          .pill-wait {
            color: rgba(255, 255, 255, 0.55);
            background: rgba(255, 255, 255, 0.06);
          }
        `}</style>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-white/45 text-sm">{title}</div>
      <div className="text-3xl mt-2 font-light">{value}</div>
    </div>
  );
}