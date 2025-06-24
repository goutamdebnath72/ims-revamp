// utils/pdfGenerators.js
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
  doc.line(margin, currentY, pageWidth - margin, currentY); // underline
  currentY += 6;

  // Incident Details Table
  const detailRows = [
    ["Incident No.", incident.incidentNumber || "1000029878"],
    ["Incident Type", incident.incidentType],
    ["Job Title", incident.jobTitle],
    ["Description", formatDescription(incident.description)],
    ["Requestor", incident.requestor],
    ["Department", incident.department],
    ["Contact", incident.contactNumber],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Field", "Value"]],
    body: detailRows,
    theme: "grid",
    styles: { fontSize: 12 },
    // ... inside the first autoTable call
    headStyles: {
      fillColor: [0, 82, 155], // blue
      textColor: 255, // white
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: pageWidth - 2 * margin - 40 },
    },
    didDrawCell: (data) => {
      currentY = data.cursor.y;
    },
  });
  currentY += 20; // Add a gap before the next section

  // NOTE: The first extra closing brace that was here has been removed.

  // Audit Trail Table
  autoTable(doc, {
    startY: currentY,
    head: [["Timestamp", "Author", "Action", "Comment"]],
    body: auditTrail.map((entry) => [
      formatDate(entry.timestamp),
      entry.author,
      entry.action,
      formatComment(entry.comment),
    ]),
    theme: "grid",
    styles: { fontSize: 12 },
    headStyles: {
      fillColor: [0, 82, 155], // blue
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { fontStyle: "normal", cellWidth: 35 },
      3: { cellWidth: pageWidth - 2 * margin - 110 },
    },
    didDrawCell: (data) => {
      currentY = data.cursor.y;
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

  doc.save(`Incident_${incident.incidentNumber || "1000029878"}.pdf`);

  // --- Helper Functions ---
  // These are nested inside generateIncidentPdf to have access to its scope if needed in the future.

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function formatComment(comment) {
    return comment.replace("Password:\n", "Password: ").replace(/\.+$/, "");
  }

  function formatDescription(desc) {
    return desc
      .replace(/(KALU BOURI)(?!,)/, "$1,")
      .replace(/(Ticket No:[^\s]+)/, "$1,")
      .replace(/(SAIL PNo:[^\s]+)/, "$1,")
      .replace(/Department:/, "Department:,");
  }
}

// NOTE: The second extra closing brace at the very end of the file has also been removed.
