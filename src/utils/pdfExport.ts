/**
 * Utility for exporting schedule document directly as PDF
 */
export async function exportScheduleToPdf(
  elementId: string,
  filename: string = 'جدول_مواد_IUST.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return false;
  }

  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [8, 8, 8, 8] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'landscape' as const,
      },
      pagebreak: {
        mode: ['css', 'legacy'] as ('css' | 'legacy')[],
        before: '.print-page-break',
        avoid: '.print-avoid-break',
      },
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.warn('Direct html2pdf export error, falling back to print dialog:', err);
    const originalTitle = document.title;
    document.title = filename.replace('.pdf', '');
    window.print();
    document.title = originalTitle;
    return false;
  }
}
