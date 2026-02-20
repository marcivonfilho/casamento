"use client";

import { useState, useEffect } from "react";

export default function RSVP({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await params;
      setCode(p.code);

      // busca nome no banco
      const res = await fetch("/api/rsvp/get?code=" + p.code);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setQty(data.qty || 1);
      }
    }
    load();
  }, [params]);

  async function enviar(e: any) {
    e.preventDefault();

    await fetch("/api/rsvp", {
      method: "POST",
      body: JSON.stringify({ code, qty, msg }),
      headers: { "Content-Type": "application/json" },
    });

    setOk(true);
  }

  if (ok) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-3xl">
        Presença confirmada ✨
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">

        <h1 className="text-center text-3xl text-white font-serif mb-2">
          Confirmar presença
        </h1>

        <p className="text-center text-white/70 mb-6">
          Olá <span className="text-white font-medium">{name}</span> 🤍
        </p>

        <form onSubmit={enviar} className="space-y-5">

          {/* quantidade */}
          <div>
            <label className="text-white/70 text-sm">Quantidade de pessoas</label>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 bg-white/20 rounded-lg text-white"
              >
                -
              </button>

              <div className="flex-1 text-center text-white text-xl">
                {qty}
              </div>

              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 bg-white/20 rounded-lg text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* mensagem */}
          <div>
            <label className="text-white/70 text-sm">Mensagem (opcional)</label>

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full mt-2 bg-white/10 text-white rounded-xl px-4 py-3 outline-none"
              placeholder="Deixe uma mensagem..."
            />
          </div>

          <button className="w-full bg-white text-black py-4 rounded-xl font-medium mt-4">
            Confirmar presença
          </button>

        </form>
      </div>
    </main>
  );
}