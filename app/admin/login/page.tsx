"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Senha incorreta");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#070708] via-[#0c0c0f] to-[#141418] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-white tracking-wide">
            Emilly & Marcivon
          </h1>
          <p className="text-white/40 mt-2">Painel administrativo</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <label className="text-sm text-white/50">Senha</label>

          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-3 mb-6 bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-white/30 transition"
          />

          <button
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-medium hover:scale-[1.02] transition duration-200 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">Acesso restrito</p>
      </div>
    </main>
  );
}