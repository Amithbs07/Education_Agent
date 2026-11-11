export function createTextStream(text: string, chunkSize: number = 18, delayMs: number = 22) {
  const encoder = new TextEncoder();
  let index = 0;

  return new ReadableStream({
    async start(controller) {
      function push() {
        if (index < text.length) {
          const chunk = text.slice(index, index + chunkSize);
          index += chunkSize;
          controller.enqueue(encoder.encode(chunk));
          setTimeout(push, delayMs);
        } else {
          controller.close();
        }
      }
      push();
    },
  });
}
