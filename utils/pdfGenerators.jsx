// File: utils/pdfGenerators.js
// UPDATED: Added new user detail fields and fixed comment formatting.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateIncidentPdf(incident, auditTrail) {
  const doc = new jsPDF({ orientation: "portrait" });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  const timestamp = new Date().toLocaleString();
  let currentY = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Incident Audit Report", margin, currentY);

  // Timestamp
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${timestamp}`, pageWidth - margin, currentY, {
    align: "right",
  });

  currentY += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // --- THIS IS THE CHANGE: Added new rows for the new user details ---
  const detailRows = [
    ["Incident No.", incident.id],
    ["Job Title", incident.jobTitle],
    ["Incident Type", incident.incidentType],
    ["Priority", incident.priority],
    ["Status", incident.status],
    ["Requestor", incident.requestor],
    ["Designation", incident.designation || "N/A"],
    ["Ticket No.", incident.ticketNo || "N/A"],
    ["SAIL P. No.", incident.sailPNo || "N/A"],
    ["Mail ID", incident.mailId || "N/A"],
    ["Department", incident.department],
    ["Contact", incident.contactNumber],
    ["Location", incident.location],
    ["Description", incident.description],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Field", "Value"]],
    body: detailRows,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: {
      fillColor: [0, 82, 155],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      // If the cell is for the 'Description' or 'Job Title', apply custom styles
      if (data.row.raw[0] === 'Description' || data.row.raw[0] === 'Job Title') {
          // This ensures the text can take up multiple lines if needed
          doc.setFontSize(10);
          doc.setTextColor(100);
      }
      currentY = data.cursor.y;
    },
  });

  currentY += 10;

  // Audit Trail Table
  autoTable(doc, {
    startY: currentY,
    head: [["Timestamp", "Author", "Action", "Comment"]],
    body: (auditTrail || []).map((entry) => [
      entry.timestamp,
      entry.author,
      entry.action,
      formatComment(entry.comment), // Use the corrected helper function
    ]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [0, 82, 155],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { fontStyle: "normal", cellWidth: 35 },
    },
  });

  // Page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      {
        align: "right",
      }
    );
  }

  doc.save(`Incident_${incident.id}.pdf`);
}

// --- THIS IS THE FIX: This function now preserves line breaks ---
function formatComment(comment) {
  // It no longer replaces newlines with spaces.
  // It just ensures the comment is a string.
  return comment ? comment.toString() : '';
}