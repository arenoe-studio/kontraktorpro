export interface PdfProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  contractValue?: number | null;
  wbs: any[];
  team: any[];
  reports: any[];
}

export interface PdfOptions {
  includeWbs: boolean;
  includeTeam: boolean;
  includeContractValue: boolean;
  selectedReportIds: string[];
}

export async function generateProjectPdf(project: PdfProject, options: PdfOptions) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  
  const projectName = project.name || "Proyek Tanpa Nama";
  doc.setFontSize(20);
  doc.text(`Laporan Proyek: ${projectName}`, 14, 22);
  
  doc.setFontSize(12);
  const statusLabel = project.status ? project.status.toUpperCase() : "UNKNOWN";
  const progressLabel = project.progress ?? 0;
  doc.text(`Status: ${statusLabel} | Progress: ${progressLabel}%`, 14, 32);
  
  let y = 42;
  
  if (options.includeContractValue && project.contractValue) {
    doc.text(`Nilai Kontrak: Rp ${project.contractValue.toLocaleString("id-ID")}`, 14, y);
    y += 10;
  }
  
  if (options.includeWbs && project.wbs && project.wbs.length > 0) {
    doc.setFontSize(16);
    doc.text("Work Breakdown Structure (WBS)", 14, y);
    y += 8;
    doc.setFontSize(10);
    project.wbs.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - Progress: ${item.progress}% (Bobot: ${item.weight}%)`, 14, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    y += 10;
  }
  
  if (options.includeTeam && project.team && project.team.length > 0) {
    if (y > 260) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(16);
    doc.text("Daftar Tim", 14, y);
    y += 8;
    doc.setFontSize(10);
    project.team.forEach((member) => {
      doc.text(`- ${member.name} (${member.role})`, 14, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    y += 10;
  }
  
  const reportsToInclude = project.reports?.filter(r => options.selectedReportIds.includes(r.id)) || [];
  if (reportsToInclude.length > 0) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(16);
    doc.text("Laporan Harian", 14, y);
    y += 8;
    doc.setFontSize(10);
    reportsToInclude.forEach((report) => {
      doc.text(`Tanggal: ${new Date(report.date).toLocaleDateString("id-ID")}`, 14, y);
      y += 5;
      doc.text(`Author: ${report.author} | Cuaca: ${report.weather}`, 14, y);
      y += 5;
      
      const notesLines = doc.splitTextToSize(`Catatan: ${report.notes || "Tidak ada catatan"}`, 180);
      doc.text(notesLines, 14, y);
      y += (notesLines.length * 5) + 5;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  doc.save(`Laporan_${projectName.replace(/\s+/g, '_')}.pdf`);
}
