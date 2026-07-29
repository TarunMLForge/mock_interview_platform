"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportPdfButtonProps {
  targetId: string;
  filename?: string;
}

export default function ExportPdfButton({ targetId, filename = "interview-report.pdf" }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.error("Target element for PDF export not found.");
      return;
    }

    setIsExporting(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin:       0.5,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in' as const, format: 'letter', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 shadow-lg shadow-blue-900/20"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {isExporting ? "Exporting..." : "Export Performance PDF"}
    </button>
  );
}
