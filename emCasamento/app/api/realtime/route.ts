import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  let controllerRef: ReadableStreamDefaultController | null = null;
  let interval: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;

      const send = (payload: any) => {
        if (!controllerRef) return;

        try {
          controllerRef.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        } catch {
          controllerRef = null;
        }
      };

      // envia conexão inicial
      send({ type: "connected" });

      // heartbeat
      interval = setInterval(() => {
        send({ type: "ping" });
      }, 20000);

      // QUANDO O CLIENTE FECHA
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controllerRef = null;
      });
    },

    cancel() {
      clearInterval(interval);
      controllerRef = null;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}