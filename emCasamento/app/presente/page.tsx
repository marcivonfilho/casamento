"use client";

import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

export default function PresentePage() {
  return (
    <main
      className="relative min-h-screen text-black flex flex-col items-center px-6 py-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(246,242,238,0.94), rgba(246,242,238,0.94)),
          url('/bg-paper.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CONTAINER CENTRAL */}
      <div className="w-full max-w-4xl relative z-10">

        {/* FOTO */}
        <div className="w-full rounded-[32px] overflow-hidden shadow-2xl mb-14">
          <Image
            src="/bg/1.jpg"
            alt="Emilly e Marcivon"
            width={1200}
            height={800}
            className="w-full object-cover"
          />
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl md:text-4xl font-serif text-center tracking-wide mb-6">
          Presente & Contribuição
        </h1>

        {/* BLOCO TEXTO ESTILO PAPEL */}
        <div className="
          bg-white/60
          backdrop-blur-md
          rounded-[32px]
          shadow-xl
          px-8 md:px-14
          py-10 md:py-14
          border border-black/5
        ">
          <p className="text-center leading-relaxed text-[15px] md:text-base text-black/80">
            Como muitos de vocês sabem, em breve iniciaremos uma nova jornada
            em uma nova cidade. Por estarmos de malas prontas e com o coração
            cheio de planos, optamos por não realizar uma lista de presentes
            tradicional, já que não teremos como levar itens físicos conosco.
            <br /><br />
            Se você desejar nos homenagear com um presente, pedimos que
            considere uma contribuição via PIX ou no cartão. Esse gesto será
            fundamental para nos ajudar a mobiliar nosso novo cantinho e
            transformar cada contribuição em um pedacinho do nosso novo lar.
            <br /><br />
            <span className="italic block mt-6">
              Com amor e carinho,<br />
              Emilly & Marcivon
            </span>
          </p>
        </div>

        {/* LINHA DECORATIVA */}
        <div className="w-20 h-[1px] bg-black/20 mx-auto my-14" />

        {/* QR + BOTÕES */}
        <div className="flex flex-col items-center gap-8">

          {/* QR CODE */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5">
            <Image
              src="/qrcode-pix.png"
              alt="QR Code PIX"
              width={220}
              height={220}
            />
          </div>

          {/* BOTÃO PIX */}
          <button
            onClick={() => {
              navigator.clipboard.writeText("00020126330014BR.GOV.BCB.PIX0111061292381935204000053039865802BR5901N6001C62070503***630458BD");
              alert("Chave PIX copiada 💌");
            }}
            className="
              px-12 py-4
              rounded-full
              bg-black text-white
              text-sm tracking-wide
              shadow-md
              hover:scale-105
              transition
            "
          >
            Copiar chave PIX
          </button>

          {/* BOTÃO CARTÃO */}
          <a
            href="https://linknabio.gg/marcivas"
            target="_blank"
            className="
              px-12 py-4
              rounded-full
              border border-black/20
              text-sm tracking-wide
              hover:bg-black hover:text-white
              transition
            "
          >
            Contribuir no cartão
          </a>

        </div>

      </div>

      <MusicPlayer src="/music2.mp3" />
    </main>
  );
}