"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  intervalMs?: number;
};

export default function BackgroundSlideshow({ images, intervalMs = 7000 }: Props) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % safeImages.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [safeImages.length, intervalMs]);

  // crossfade: imagem atual + próxima
  const current = safeImages[idx] ?? safeImages[0];
  const next = safeImages.length ? safeImages[(idx + 1) % safeImages.length] : current;

  return (
    <div className="absolute inset-0">
      {/* base */}
      <img
        src={current}
        className="absolute inset-0 h-full w-full object-cover object-center md:object-[60%_center]"
        alt=""
        draggable={false}
      />

      {/* próxima imagem (fade-in/out controlado via key) */}
      <img
        key={next}
        src={next}
        className="absolute inset-0 h-full w-full object-cover object-center md:object-[60%_center] opacity-0 animate-fadeIn"
        alt=""
        draggable={false}
      />
    </div>
  );
}