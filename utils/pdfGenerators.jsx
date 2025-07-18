// File: utils/pdfGenerators.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

  // --- Incident Details ---
  // CORRECTED: Simplified email logic to be more robust.
  const displayEmailSail = incident.emailSail || "N/A";
  const displayEmailNic = incident.emailNic || "N/A";

  const leftColumnDetails = [
    { label: "Incident No.", value: incident.id },
    { label: "Incident Type", value: incident.incidentType },
    { label: "Job Title", value: incident.jobTitle },
    { label: "Description", value: incident.description },
    { label: "Requestor", value: incident.requestor },
    { label: "Department", value: incident.department },
    { label: "Email ID", value: displayEmailSail },
    { label: "IP Address", value: incident.ipAddress },
  ];

  // CORRECTED: The layout is now rearranged exactly as you requested.
  const rightColumnDetails = [
    { label: "Reported On", value: incident.reportedOn },
    { label: "Status", value: incident.status },
    { label: "Priority", value: incident.priority },
    { label: "", value: "" }, // Placeholder to align with Description
    { label: "Ticket No.", value: incident.ticketNo },
    { label: "SAIL P/No", value: incident.sailpno },
    { label: "Email ID (NIC)", value: displayEmailNic },
    { label: "Job From", value: incident.jobFrom },
  ];

  const colWidth = (pageWidth - margin * 2) / 2;
  const labelWidth = 40;
  const valueWidth = colWidth - labelWidth;
  const rightColX = margin + colWidth;
  const lineHeight = 5;
  const padding = 2;

  doc.setFontSize(11);
  doc.setLineWidth(0.2);

  const rowCount = Math.max(
    leftColumnDetails.length,
    rightColumnDetails.length
  );
  for (let i = 0; i < rowCount; i++) {
    const leftItem = leftColumnDetails[i] || { label: "", value: "" };
    const rightItem = rightColumnDetails[i] || { label: "", value: "" };
    const leftValueText = doc.splitTextToSize(
      String(leftItem.value || "N/A"),
      valueWidth - padding * 2
    );
    const rightValueText = doc.splitTextToSize(
      String(rightItem.value || "N/A"),
      valueWidth - padding * 2
    );
    const rowHeight =
      Math.max(leftValueText.length, rightValueText.length) * lineHeight +
      padding * 2;

    // Draw Left Column
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, labelWidth, rowHeight, "F");
    doc.text(
      leftItem.label,
      margin + padding,
      currentY + padding + lineHeight - 1
    );

    doc.setFillColor(255, 255, 255);
    doc.rect(margin + labelWidth, currentY, valueWidth, rowHeight, "F");
    doc.text(
      leftValueText,
      margin + labelWidth + padding,
      currentY + padding + lineHeight - 1
    );

    // Draw Right Column
    if (rightItem.label) {
      doc.setFillColor(240, 240, 240);
      doc.rect(rightColX, currentY, labelWidth, rowHeight, "F");
      doc.text(
        rightItem.label,
        rightColX + padding,
        currentY + padding + lineHeight - 1
      );

      doc.setFillColor(255, 255, 255);
      doc.rect(rightColX + labelWidth, currentY, valueWidth, rowHeight, "F");
      doc.text(
        rightValueText,
        rightColX + labelWidth + padding,
        currentY + padding + lineHeight - 1
      );
    }

    // Draw borders for the row
    doc.rect(margin, currentY, colWidth * 2, rowHeight);
    currentY += rowHeight;
  }

  currentY += 10;

  // --- Audit Trail Table ---

  autoTable(doc, {
    startY: currentY,
    head: [["Timestamp", "Author", "Action", "Comment"]],
    body: (auditTrail || []).map((entry) => [
      entry.timestamp,
      entry.author,
      entry.action,
      entry.comment || "",
    ]),
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
          const filledSymbol = "H"; // ZapfDingbats: filled star
          const emptySymbol = "I"; // ZapfDingbats: empty star

          const rating = Math.round(entry.rating || 0);
          const stars =
            filledSymbol.repeat(rating) + emptySymbol.repeat(5 - rating);

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
          const starOffsetX = ratingX + labelWidth - 25;
          const starOffsetY = ratingY + 2.3;

          doc.setTextColor(0, 0, 0); // Make stars pure black

          for (let i = 0; i < 5; i++) {
            const symbol = i < rating ? "H" : "I"; // filled or empty
            doc.text(symbol, starOffsetX + i * 5, starOffsetY); // spacing: 10 units
          }

          doc.setTextColor(33, 33, 33); // Reset to default dark grey


          // Restore font
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
        } else if (
          entry.action.toLowerCase().includes("resolved") ||
          entry.action.toLowerCase().includes("closed")
        ) {
          // If this is the final entry but no rating was found, print a diagnostic message
          const textY = cell.y + cell.height - cell.padding("bottom") - 2;
          doc.setFontSize(8);
          doc.setTextColor(150); // Set color to gray
          doc.text(
            "[No rating provided]",
            cell.x + cell.padding("left"),
            textY
          );
          doc.setTextColor(0); // Reset color to black
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
