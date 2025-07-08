// File: utils/pdfGenerators.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function formatComment(comment) {
  return comment ? comment.toString() : '';
}

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
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin, currentY, { align: "right" });
  currentY += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- NEW: Two-Column Layout for Incident Details ---

  // 1. Prepare the data for two columns
  const displayEmailSail = incident.emailSail?.endsWith('@saildsp.co.in') ? incident.emailSail : 'N/A';
  const displayEmailNic = incident.emailNic?.endsWith('@sail.in') ? incident.emailNic : 'N/A';

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

  const rightColumnDetails = [
      { label: "Status", value: incident.status },
      { label: "Priority", value: incident.priority },
      { label: "", value: "" }, // Placeholder to align with Job Title
      { label: "", value: "" }, // Placeholder to align with Description
      { label: "Ticket No.", value: incident.ticketNo },
      { label: "SAIL P/No", value: incident.sailPNo },
      { label: "Email ID (NIC)", value: displayEmailNic },
      { label: "Job From", value: incident.jobFrom },
  ];
  
  // 2. Define layout parameters
  const colWidth = (pageWidth - (margin * 2)) / 2;
  const labelWidth = 40;
  const valueWidth = colWidth - labelWidth;
  const rightColX = margin + colWidth;
  const lineHeight = 5; // Approx height for a single line of text
  const padding = 2;
  
  doc.setFontSize(10);
  doc.setLineWidth(0.2);

  // 3. Loop and draw both columns simultaneously
  const rowCount = Math.max(leftColumnDetails.length, rightColumnDetails.length);
  for (let i = 0; i < rowCount; i++) {
      const leftItem = leftColumnDetails[i] || { label: '', value: '' };
      const rightItem = rightColumnDetails[i] || { label: '', value: '' };

      const leftValueText = doc.splitTextToSize(String(leftItem.value || 'N/A'), valueWidth - (padding * 2));
      const rightValueText = doc.splitTextToSize(String(rightItem.value || 'N/A'), valueWidth - (padding * 2));
      
      const rowHeight = Math.max(leftValueText.length, rightValueText.length) * lineHeight + (padding * 2);

      // Draw Left Column
      doc.setFillColor(240, 240, 240); // Light Grey
      doc.rect(margin, currentY, labelWidth, rowHeight, 'F');
      doc.text(leftItem.label, margin + padding, currentY + padding + lineHeight - 1);
      
      doc.setFillColor(255, 255, 255); // White
      doc.rect(margin + labelWidth, currentY, valueWidth, rowHeight, 'F');
      doc.text(leftValueText, margin + labelWidth + padding, currentY + padding + lineHeight - 1);
      
      // Draw Right Column
      if (rightItem.label) {
          doc.setFillColor(240, 240, 240); // Light Grey
          doc.rect(rightColX, currentY, labelWidth, rowHeight, 'F');
          doc.text(rightItem.label, rightColX + padding, currentY + padding + lineHeight - 1);
          
          doc.setFillColor(255, 255, 255); // White
          doc.rect(rightColX + labelWidth, currentY, valueWidth, rowHeight, 'F');
          doc.text(rightValueText, rightColX + labelWidth + padding, currentY + padding + lineHeight - 1);
      }

      // Draw borders for the row
      doc.rect(margin, currentY, colWidth * 2, rowHeight);
      
      currentY += rowHeight;
  }
  
  currentY += 10; // Space before the next table

  // --- Audit Trail Table (Unchanged) ---
  autoTable(doc, {
    startY: currentY,
    head: [["Timestamp", "Author", "Action", "Comment"]],
    body: (auditTrail || []).map((entry) => [
      entry.timestamp,
      entry.author,
      entry.action,
      formatComment(entry.comment),
    ]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [0, 82, 155], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { fontStyle: "normal", cellWidth: 35 },
    },
  });

  // --- Page numbers ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: "right" });
  }

  doc.save(`Incident_${incident.id}.pdf`);
}