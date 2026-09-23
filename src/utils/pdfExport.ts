/**
 * Utility for exporting schedule document directly as high-resolution PDF
 * and triggering immediate browser download into device's Downloads folder.
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

    // A4 Landscape is 297mm x 210mm.
    // Margins of 6mm all around leave 285mm x 198mm of printable area.
    const opt = {
      margin: [6, 6, 6, 6] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1120, // Match fixed A4 landscape width to prevent edge clipping
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

    // Generate PDF Blob directly to guarantee browser download trigger
    const worker = html2pdf().set(opt).from(element);
    const pdfBlob: Blob = await worker.output('blob');

    // Trigger instant native browser download to Downloads folder
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 15000);

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
