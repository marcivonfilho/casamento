"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  volume?: number; // opcional (0 a 1)
};

export default function MusicPlayer({ src, volume = 0.6 }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // evita múltiplas execuções do "primeiro start"
  const startedRef = useRef(false);

  // troca música quando src mudar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = !audio.paused;

    audio.pause();
    audio.src = src;
    audio.load();
    audio.volume = volume;

    // se já estava tocando antes, volta a tocar a nova
    if (wasPlaying || playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      setPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // função que tenta iniciar uma vez
  const tryStartOnce = async () => {
    const audio = audioRef.current;
    if (!audio || startedRef.current) return;

    audio.volume = volume;

    try {
      await audio.play();
      startedRef.current = true;
      setPlaying(true);
      removeStartListeners();
    } catch {
      // se bloquear, continua esperando outro evento
    }
  };

  // remove listeners (depois que tocar)
  const removeStartListeners = () => {
    window.removeEventListener("pointerdown", tryStartOnce as any);
    window.removeEventListener("touchstart", tryStartOnce as any);
    window.removeEventListener("keydown", tryStartOnce as any);
    window.removeEventListener("wheel", tryStartOnce as any, { passive: true } as any);
    window.removeEventListener("scroll", tryStartOnce as any, { passive: true } as any);
  };

  // adiciona listeners de “primeira interação”
  useEffect(() => {
    // se já tocou antes, não precisa
    if (startedRef.current) return;

    // pointerdown cobre click + toque moderno
    window.addEventListener("pointerdown", tryStartOnce as any);
    window.addEventListener("touchstart", tryStartOnce as any);
    window.addEventListener("keydown", tryStartOnce as any);

    // wheel pega trackpad / roda do mouse
    window.addEventListener("wheel", tryStartOnce as any, { passive: true });

    // scroll pega rolagem geral (inclusive mobile)
    window.addEventListener("scroll", tryStartOnce as any, { passive: true });

    return () => removeStartListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // play/pause manual
  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        startedRef.current = true; // se clicou no botão, já considera iniciado
        setPlaying(true);
        removeStartListeners();
      } catch {}
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto" />

      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        className="
          fixed bottom-6 right-6 z-50
          w-12 h-12 rounded-full
          bg-white/90 backdrop-blur-md
          shadow-xl
          flex items-center justify-center
          transition
          hover:scale-110 hover:bg-white
          active:scale-95
        "
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}