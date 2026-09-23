/**
 * High-performance, non-blocking PDF export utility
 * Generates and downloads A4 Landscape PDF directly to the user's Downloads folder
 * without locking or freezing the browser thread.
 */
export async function exportScheduleToPdf(
  elementId: string,
  filename: string = 'جدول_مواد_IUST.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Export error: element #${elementId} not found`);
    return false;
  }

  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    // A4 Landscape: 297mm x 210mm.
    // 6mm margins leave 285mm x 198mm.
    const opt = {
      margin: [6, 6, 6, 6] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: {
        scale: 1.5, // 1.5 scale is crisp and light on memory, prevents mobile browser freezing
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'landscape' as const,
        compress: true,
      },
      pagebreak: {
        mode: ['css', 'legacy'] as ('css' | 'legacy')[],
        before: '.print-page-break',
        avoid: '.print-avoid-break',
      },
    };

    // Standard html2pdf save triggers clean, native browser file download
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    // Never call window.print() inside catch to avoid freezing the browser inside iframes
    return false;
  }
}
