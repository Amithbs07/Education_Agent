export interface TextChunk {
  content: string;
  chunkIndex: number;
  pageNumber?: number;
  sectionTitle?: string;
}

export function chunkText(
  text: string,
  chunkSize: number = 600,
  overlap: number = 100
): TextChunk[] {
  if (!text || text.trim().length === 0) return [];

  const cleanText = text.replace(/\r\n/g, "\n");
  const paragraphs = cleanText.split(/\n\s*\n/);
  const chunks: TextChunk[] = [];

  let currentChunk = "";
  let chunkIndex = 0;
  let estimatedPage = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Estimate page transition roughly every 2500 characters
    if (chunks.length > 0 && chunks.length % 4 === 0) {
      estimatedPage++;
    }

    if (currentChunk.length + trimmed.length <= chunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    } else {
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          chunkIndex: chunkIndex++,
          pageNumber: estimatedPage,
        });
      }

      // If a single paragraph is longer than chunkSize, break it down
      if (trimmed.length > chunkSize) {
        let subStart = 0;
        while (subStart < trimmed.length) {
          const subEnd = Math.min(subStart + chunkSize, trimmed.length);
          const subText = trimmed.slice(subStart, subEnd);
          chunks.push({
            content: subText.trim(),
            chunkIndex: chunkIndex++,
            pageNumber: estimatedPage,
          });
          subStart += chunkSize - overlap;
        }
        currentChunk = "";
      } else {
        // Carry forward overlap from the end of the previous chunk
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + "\n\n" + trimmed;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex++,
      pageNumber: estimatedPage,
    });
  }

  return chunks;
}
