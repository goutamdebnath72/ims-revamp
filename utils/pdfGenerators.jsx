// File: utils/pdfGenerators.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

export function generateIncidentPdf(incident, auditTrail) {
  const doc = new jsPDF({ orientation: "portrait" });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = margin;

  // --- Header ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Incident Audit Report", margin, currentY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth - margin,
    currentY,
    { align: "right" }
  );
  currentY += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- Incident Details Table ---
  const incidentDetails = [
    [
      "Incident No.",
      incident.id,
      "Reported On",
      DateTime.fromISO(incident.reportedOn)
        .setZone("Asia/Kolkata")
        .toFormat("dd/MM/yyyy, HH:mm:ss"),
    ],
    ["Incident Type", incident.incidentType?.name, "Status", incident.status],
    ["Job Title", incident.jobTitle, "Priority", incident.priority],
    // This is the fix: Description row now spans all 3 following columns
    [
      {
        content: "Description",
        styles: { fontStyle: "bold", valign: "middle" },
      },
      {
        content: incident.description.toUpperCase(),
        colSpan: 3,
        styles: { fontStyle: "bold", valign: "middle" },
      },
    ],
    [
      "Requestor",
      incident.requestor?.name,
      "Ticket No.",
      incident.requestor?.ticketNo || "N/A",
    ],
    [
      "Department",
      incident.requestor?.department?.name,
      "SAIL P/No",
      incident.requestor?.sailPNo || "N/A",
    ],
    [
      "Email ID",
      incident.requestor?.emailId || "N/A",
      "Email ID (NIC)",
      incident.requestor?.emailIdNic || "N/A",
    ],
    ["IP Address", incident.ipAddress, "Job From", incident.jobFrom],
  ];

  autoTable(doc, {
    startY: currentY,
    body: incidentDetails,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35 },
      2: { fontStyle: "bold", cellWidth: 35 },
    },
    didParseCell: (data) => {
      // This makes the label cells look like the old version
      if (
        data.cell.section === "body" &&
        (data.column.index === 0 || data.column.index === 2)
      ) {
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // --- Audit Trail Table ---

  autoTable(doc, {
    startY: currentY,
    head: [["Timestamp", "Author", "Action", "Comment"]],
    body: (auditTrail || []).map((entry) => {
      const cleanedComment = (entry.comment || "")
        .replace("Final Rating:", "")
        .trim();
      return [
        DateTime.fromISO(entry.timestamp)
          .setZone("Asia/Kolkata")
          .toFormat("ccc LLL d, yyyy h:mm a"),
        entry.author,
        entry.action,
        // This ternary logic correctly adds the newline ONLY if a rating exists
        entry.rating ? `${cleanedComment}\n` : cleanedComment,
      ];
    }),
    theme: "grid",
    styles: {
      fontSize: 11,
      cellPadding: { top: 4, bottom: 4, left: 2, right: 2 }, // ↑ Added more vertical spacing
      minCellHeight: 12, // Optional: ensure minimum height
      valign: "middle",
    },

    headStyles: {
      fillColor: [0, 82, 155],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 12,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { fontStyle: "normal", cellWidth: 35 },
    },
    didDrawCell: (data) => {
      // Only customize the 'Comment' column (index 3)
      if (data.column.index === 3) {
        const entry = auditTrail[data.row.index];
        const separator = "\n---\n";
        const doc = data.doc;
        const cell = data.cell;

        // Logic for the separator line
        if (entry.comment && entry.comment.includes(separator)) {
          const [header, body] = entry.comment.split(separator);

          // FIX #1: Erase background without touching borders
          const borderWidth = 0.1;
          doc.setFillColor(255, 255, 255);
          doc.rect(
            cell.x + borderWidth,
            cell.y + borderWidth,
            cell.width - borderWidth * 2,
            cell.height - borderWidth * 2,
            "F"
          );

          // FIX #2: Correct text alignment and spacing
          const textOptions = { baseline: "top" }; // Align text from the top
          const padding = 2; // Vertical padding
          const headerText = doc.splitTextToSize(
            header,
            cell.width - cell.padding("horizontal")
          );
          doc.text(
            headerText,
            cell.x + cell.padding("left"),
            cell.y + cell.padding("top"),
            textOptions
          );

          const lineHeight = doc.getTextDimensions("M").h;
          const lineY =
            cell.y +
            cell.padding("top") +
            headerText.length * lineHeight +
            padding;
          const lineLength = cell.width * 0.8;
          doc.setLineWidth(0.1);
          doc.line(
            cell.x + cell.padding("left"),
            lineY,
            cell.x + cell.padding("left") + lineLength,
            lineY
          );

          const bodyText = doc.splitTextToSize(
            body,
            cell.width - cell.padding("horizontal")
          );
          doc.text(
            bodyText,
            cell.x + cell.padding("left"),
            lineY + padding,
            textOptions
          );
        }

        // Logic for the star rating
        // Inside the loop that renders each audit trail entry
        // After rendering the entry's comment...
        if (entry.rating && entry.rating > 0) {
          const rating = Math.round(entry.rating || 0);
          const ratingY = cell.y + cell.height - cell.padding("bottom") - 2;
          const ratingX = cell.x + cell.padding("left");

          // Draw label
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text("Final Rating:", ratingX, ratingY + 2);

          // Draw stars aligned just after the label
          doc.setFont("zapfdingbats");
          doc.setFontSize(14);
          const labelWidth = doc.getTextWidth("Final Rating: ");

          // --- THIS IS THE CORRECTED LINE ---
          // Using the calculation from your original file for perfect alignment
          const starOffsetX = ratingX + labelWidth - 25;
          const starOffsetY = ratingY + 2.3;

          doc.setTextColor(0, 0, 0); // Make stars pure black

          for (let i = 0; i < 5; i++) {
            const symbol = i < rating ? "H" : "I"; // filled or empty
            doc.text(symbol, starOffsetX + i * 5, starOffsetY);
          }

          doc.setTextColor(33, 33, 33); // Reset to default dark grey

          // Restore font
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
        }
      }
    },
  });

  // --- Page numbers ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  doc.save(`Incident_${incident.id}.pdf`);
}
