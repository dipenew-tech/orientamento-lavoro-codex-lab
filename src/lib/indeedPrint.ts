import type { IndeedPrintPage } from "../types";

export const INDEED_RESULTS_HEADING = "Ecco come esempio i risultati ad oggi delle offerte di lavoro che ti interessano";

export async function readIndeedPrint(file: File): Promise<IndeedPrintPage[]> {
  if (file.size > 20 * 1024 * 1024) throw new Error("Il PDF supera 20 MB.");
  const signature = await file.slice(0, 5).text();
  if (signature !== "%PDF-") throw new Error("Scegli il PDF salvato dalla stampa di Indeed.");

  const [{ getDocument, GlobalWorkerOptions }, { default: workerUrl }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  GlobalWorkerOptions.workerSrc = workerUrl;
  const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });

  try {
    const pdf = await task.promise;
    if (pdf.numPages > 12) throw new Error("Salva fino a 12 pagine dalla stampa di Indeed.");
    const pages: IndeedPrintPage[] = [];
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number);
      const size = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 1400 / Math.max(size.width, size.height) });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Il browser non riesce a leggere le pagine del PDF.");
      await page.render({ canvas, canvasContext: context, viewport, background: "#ffffff" }).promise;
      pages.push({ image: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height });
      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
    }
    return pages;
  } finally {
    await task.destroy();
  }
}
