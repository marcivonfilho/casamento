"use client";

import { useState } from "react";

export default function RSVPModal({
  open,
  onClose,
  code = "PUBLIC",
}: {
  open: boolean;
  onClose: () => void;
  code?: string;
}) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [mode, setMode] = useState<"single" | "family">("single");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function send() {
    if (!name.trim()) {
      alert("Digite seu nome");
      return;
    }

    setLoading(true);

    await fetch("/api/rsvp", {
      method: "POST",
      body: JSON.stringify({
        name,
        qty: mode === "single" ? 1 : qty,
        msg,
        code,
      }),
    });

    setLoading(false);
    onClose();
    alert("Presença confirmada 💍");
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md text-white">

        <h2 className="text-2xl font-serif text-center mb-6">
          Confirmar presença
        </h2>

        {/* ESCOLHA */}
        <div className="flex gap-3 mb-6">

          <button
            onClick={() => setMode("single")}
            className={`flex-1 py-3 rounded-xl border ${
              mode === "single"
                ? "bg-white text-black"
                : "bg-white/5 border-white/20"
            }`}
          >
            Só eu
          </button>

          <button
            onClick={() => setMode("family")}
            className={`flex-1 py-3 rounded-xl border ${
              mode === "family"
                ? "bg-white text-black"
                : "bg-white/5 border-white/20"
            }`}
          >
            Família
          </button>

        </div>

        {/* NOME */}
        <input
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none"
        />

        {/* QUANTIDADE (SÓ SE FAMÍLIA) */}
        {mode === "family" && (
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none"
          />
        )}

        {/* MSG */}
        <textarea
          placeholder="Mensagem (opcional)"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full mb-6 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none"
        />

        {/* BOTÃO */}
        <button
          onClick={send}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-medium hover:scale-[1.02] transition"
        >
          {loading ? "Enviando..." : "Confirmar"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-white/50 text-sm"
        >
          fechar
        </button>
      </div>
    </div>
  );
}