import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export interface ExportData {
  title: string;
  period: string;
  kandang?: string;
  summary: {
    saldoAwal: number;
    totalPemasukan: number;
    totalPengeluaran: number;
    saldoAkhir: number;
  };
  transactions: Array<{
    tanggal: string;
    keterangan: string;
    debit: number | string;
    kredit: number | string;
    saldo: number | string;
  }>;
}

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export async function exportToExcel(data: ExportData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Keuangan");

  // Format period to Indonesian month name
  const [year, month] = data.period.split("-");
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const formattedPeriod = `${monthNames[parseInt(month) - 1]} ${year}`;
  const kandangName = data.kandang || "Semua Kandang";

  // Header
  worksheet.mergeCells("A1:E1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `LAPORAN KEUANGAN - ${kandangName.toUpperCase()}`;
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  worksheet.getRow(1).height = 25;

  worksheet.getCell("A2").value = "Periode";
  worksheet.getCell("B2").value = formattedPeriod;
  worksheet.getCell("A2").font = { bold: true };

  // Summary
  worksheet.getCell("A4").value = "Keterangan";
  worksheet.getCell("B4").value = "Jumlah";
  ["A4", "B4"].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
    worksheet.getCell(cell).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
  });

  const summaryData = [
    ["Saldo Awal", data.summary.saldoAwal],
    ["Total Pemasukan", data.summary.totalPemasukan],
    ["Total Pengeluaran", data.summary.totalPengeluaran],
    ["Saldo Akhir", data.summary.saldoAkhir],
  ];

  summaryData.forEach((row, idx) => {
    const rowNum = 5 + idx;
    worksheet.getCell(`A${rowNum}`).value = row[0];
    worksheet.getCell(`B${rowNum}`).value = row[1];
    worksheet.getCell(`B${rowNum}`).numFmt = "#,##0";
  });

  // Transaction header
  const headerRow = 10;
  const headers = ["Tanggal", "Keterangan", "Debit (Masuk)", "Kredit (Keluar)", "Saldo"];
  headers.forEach((header, idx) => {
    const cell = worksheet.getCell(headerRow, idx + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // Saldo Awal row
  let currentRow = headerRow + 1;
  worksheet.getCell(currentRow, 2).value = "Saldo Awal";
  worksheet.getCell(currentRow, 5).value = data.summary.saldoAwal;
  worksheet.getCell(currentRow, 5).numFmt = "#,##0";
  worksheet.getCell(currentRow, 2).font = { bold: true };

  // Transactions
  data.transactions.forEach((t) => {
    currentRow++;
    worksheet.getCell(currentRow, 1).value = t.tanggal;
    worksheet.getCell(currentRow, 2).value = t.keterangan;
    if (typeof t.debit === "number") {
      worksheet.getCell(currentRow, 3).value = t.debit;
      worksheet.getCell(currentRow, 3).numFmt = "#,##0";
    }
    if (typeof t.kredit === "number") {
      worksheet.getCell(currentRow, 4).value = t.kredit;
      worksheet.getCell(currentRow, 4).numFmt = "#,##0";
    }
    if (typeof t.saldo === "number") {
      worksheet.getCell(currentRow, 5).value = t.saldo;
      worksheet.getCell(currentRow, 5).numFmt = "#,##0";
    }
  });

  // Total row
  currentRow++;
  worksheet.getCell(currentRow, 2).value = "TOTAL";
  worksheet.getCell(currentRow, 3).value = data.summary.totalPemasukan;
  worksheet.getCell(currentRow, 4).value = data.summary.totalPengeluaran;
  worksheet.getCell(currentRow, 5).value = data.summary.saldoAkhir;
  [2, 3, 4, 5].forEach((col) => {
    worksheet.getCell(currentRow, col).font = { bold: true };
    worksheet.getCell(currentRow, col).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
    if (col > 2) worksheet.getCell(currentRow, col).numFmt = "#,##0";
  });

  // Borders for all cells
  for (let row = 1; row <= currentRow; row++) {
    for (let col = 1; col <= 5; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  // Column widths
  worksheet.getColumn(1).width = 15;
  worksheet.getColumn(2).width = 45;
  worksheet.getColumn(3).width = 18;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 18;

  // Alignment
  worksheet.getColumn(3).alignment = { horizontal: "right" };
  worksheet.getColumn(4).alignment = { horizontal: "right" };
  worksheet.getColumn(5).alignment = { horizontal: "right" };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const kandangSlug = data.kandang ? data.kandang.replace(/\s+/g, "_") : "Semua_Kandang";
  a.download = `Laporan_Keuangan_${kandangSlug}_${data.period}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF() as JsPDFWithAutoTable;

  // Format period to Indonesian month name
  const [year, month] = data.period.split("-");
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const formattedPeriod = `${monthNames[parseInt(month) - 1]} ${year}`;
  const kandangName = data.kandang || "Semua Kandang";

  // Header with background
  doc.setFillColor(15, 23, 42);
  doc.rect(14, 10, 182, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`LAPORAN KEUANGAN - ${kandangName.toUpperCase()}`, 105, 17, { align: "center" });

  // Period
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Periode:", 14, 27);
  doc.setFont("helvetica", "normal");
  doc.text(formattedPeriod, 35, 27);

  // Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan", 14, 37);
  
  autoTable(doc, {
    startY: 40,
    head: [["Keterangan", "Jumlah"]],
    body: [
      ["Saldo Awal", formatCurrency(data.summary.saldoAwal)],
      ["Total Pemasukan", formatCurrency(data.summary.totalPemasukan)],
      ["Total Pengeluaran", formatCurrency(data.summary.totalPengeluaran)],
      ["Saldo Akhir", formatCurrency(data.summary.saldoAkhir)],
    ],
    theme: "grid",
    headStyles: { 
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 82, halign: "right" }
    },
    styles: { fontSize: 10 }
  });

  // Transactions
  const finalY = doc.lastAutoTable?.finalY || 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detail Transaksi", 14, finalY + 10);

  // Add Saldo Awal row
  const transactionsBody = [
    ["", "Saldo Awal", "", "", formatCurrency(data.summary.saldoAwal)],
    ...data.transactions.map((t) => [
      t.tanggal,
      t.keterangan,
      typeof t.debit === "number" ? formatCurrency(t.debit) : "-",
      typeof t.kredit === "number" ? formatCurrency(t.kredit) : "-",
      typeof t.saldo === "number" ? formatCurrency(t.saldo) : "",
    ]),
    ["", "TOTAL", formatCurrency(data.summary.totalPemasukan), formatCurrency(data.summary.totalPengeluaran), formatCurrency(data.summary.saldoAkhir)],
  ];

  autoTable(doc, {
    startY: finalY + 13,
    head: [["Tanggal", "Keterangan", "Debit (Masuk)", "Kredit (Keluar)", "Saldo"]],
    body: transactionsBody,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { 
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" }
    },
    didParseCell: (data) => {
      // Bold and gray background for Saldo Awal and TOTAL rows
      if (data.section === "body" && (data.row.index === 0 || data.row.index === transactionsBody.length - 1)) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [226, 232, 240];
      }
    }
  });

  const kandangSlug = data.kandang ? data.kandang.replace(/\s+/g, "_") : "Semua_Kandang";
  doc.save(`Laporan_Keuangan_${kandangSlug}_${data.period}.pdf`);
}
