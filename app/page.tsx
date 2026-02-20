"use client";

import { useEffect, useState } from "react";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import RSVPModal from "@/components/RSVPModal";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [tempo, setTempo] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alvo = new Date("2026-03-07T17:00:00");

    const timer = setInterval(() => {
      const agora = new Date();
      const diff = alvo.getTime() - agora.getTime();

      const dias = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const horas = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const min = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));

      setTempo(`${dias} dias • ${horas}h ${min}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">

      <BackgroundSlideshow
        images={[
          "/bg/1.jpg",
          "/bg/5.jpg",
          "/bg/3.jpg",
          "/bg/6.jpg",
          "/bg/2.jpg",
          "/bg/4.jpg",
        ]}
        intervalMs={7000}
      />

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">

        {/* NOMES */}
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.12em]">
          Emilly <span className="opacity-60">&</span> Marcivon
        </h1>

        {/* SUBTITULO */}
        <p className="mt-6 text-lg tracking-widest opacity-80">
          Casamento & Chá de Panela
        </p>

        {/* DATA */}
        <p className="mt-2 opacity-80">
          07 de Março de 2026 • 17:00
        </p>

        {/* CONTADOR */}
        <div className="
          bg-white/10 backdrop-blur-xl
          border border-white/20
          px-12 py-7
          rounded-3xl
          mt-10 mb-12
          shadow-2xl
        ">
          <p className="text-sm opacity-70 mb-2 tracking-widest">FALTAM</p>
          <p className="text-3xl md:text-4xl font-light">{tempo}</p>
        </div>

        {/* BOTÃO RSVP */}
        <button
          onClick={() => setOpen(true)}
          className="
          px-14 py-4
          rounded-full
          bg-white
          text-black
          text-lg
          font-medium
          shadow-2xl
          hover:scale-[1.03]
          transition
          "
        >
          Confirmar presença
        </button>

        {/* BLOCO AÇÕES */}
        <div className="mt-14 flex flex-col items-center gap-3">

          <p className="text-[11px] tracking-[0.35em] uppercase opacity-60">
            Chácara • Barra do Garças • MT
          </p>

          <div className="flex gap-6 mt-2">

            {/* LOCALIZAÇÃO */}
            <a
              href="https://maps.app.goo.gl/MYHJgfoPupsiAaLWA"
              target="_blank"
              className="
              flex flex-col items-center gap-2
              text-white text-xs tracking-wide
              hover:scale-105 transition
              "
            >
              <div className="
                w-12 h-12 rounded-full
                bg-white/10 backdrop-blur-xl
                border border-white/20
                flex items-center justify-center
                hover:bg-white hover:text-black
                transition
              ">
                📍
              </div>
              <span>Localização</span>
            </a>

            {/* PRESENTE / DOAÇÃO */}
            <a
              href="/presente"
              className="
              flex flex-col items-center gap-2
              text-white text-xs tracking-wide
              hover:scale-105 transition
              "
            >
              <div className="
                w-12 h-12 rounded-full
                bg-white/10 backdrop-blur-xl
                border border-white/20
                flex items-center justify-center
                hover:bg-white hover:text-black
                transition
              ">
                🎁
              </div>
              <span>Presente</span>
            </a>

          </div>
        </div>

      </div>

      <RSVPModal open={open} onClose={() => setOpen(false)} />
      <MusicPlayer src="/music.mp3" />

    </main>
  );
}