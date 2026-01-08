import jsPDF from "jspdf";

interface VoteReceiptData {
  voterName: string;
  voterId: string;
  electionTitle: string;
  candidateName: string;
  candidateParty: string;
  timestamp: Date;
  transactionId: string;
}

export function generateVoteReceipt(data: VoteReceiptData): void {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // ==================== HEADER ====================
    doc.setFillColor(27, 38, 59); // Navy blue
    doc.rect(0, 0, pageWidth, 50, "F");
    
    // Ashoka Chakra (simplified circle)
    doc.setDrawColor(255, 193, 7); // Gold
    doc.setLineWidth(0.5);
    doc.circle(pageWidth / 2, 20, 8);
    
    // Spokes of Ashoka Chakra
    doc.setTextColor(255, 193, 7);
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = pageWidth / 2 + 5 * Math.cos(angle);
      const y1 = 20 + 5 * Math.sin(angle);
      const x2 = pageWidth / 2 + 8 * Math.cos(angle);
      const y2 = 20 + 8 * Math.sin(angle);
      doc.line(x1, y1, x2, y2);
    }
    
    // Header text
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("भारत निर्वाचन आयोग", pageWidth / 2, 35, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Election Commission of India", pageWidth / 2, 42, { align: "center" });
    
    // ==================== TITLE ====================
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("मतदान रसीद", margin, 62, { align: "left" });
    doc.setFontSize(14);
    doc.text("Vote Receipt", margin, 70, { align: "left" });
    
    // Success badge
    doc.setFillColor(34, 197, 94); // Green
    doc.roundedRect(pageWidth - margin - 50, 60, 50, 12, 2, 2, "F");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("✓ मतदान सफल", pageWidth - margin - 25, 68, { align: "center" });
    
    // Transaction ID
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Transaction ID: ${data.transactionId}`, margin, 80);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, 85, pageWidth - margin, 85);
    
    // ==================== DETAILS SECTION ====================
    let yPos = 92;
    const labelWidth = 50;
    const detailWidth = contentWidth - labelWidth;
    
    const addDetailRow = (labelEn: string, labelHi: string, valueEn: string, valueHi: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(labelHi, margin, yPos);
      doc.setFontSize(9);
      doc.text(`(${labelEn})`, margin + 0.5, yPos + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(valueHi, margin + labelWidth, yPos);
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`(${valueEn})`, margin + labelWidth, yPos + 5);
      
      yPos += 14;
    };
    
    addDetailRow("Voter Name", "मतदाता का नाम", data.voterName, data.voterName);
    addDetailRow("Voter ID", "मतदाता ID", data.voterId, data.voterId);
    addDetailRow("Election", "चुनाव", data.electionTitle, data.electionTitle);
    addDetailRow("Candidate", "उम्मीदवार", data.candidateName, data.candidateName);
    addDetailRow("Party", "दल", data.candidateParty, data.candidateParty);
    
    const dateStr = data.timestamp.toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = data.timestamp.toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    
    addDetailRow("Date", "दिनांक", dateStr, dateStr);
    addDetailRow("Time", "समय", timeStr, timeStr);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    yPos += 10;
    
    // ==================== SECURITY NOTICE ====================
    doc.setFillColor(254, 243, 199); // Light amber
    doc.setDrawColor(245, 158, 11); // Amber border
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, contentWidth, 28, 2, 2, "FD");
    
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.setFont("helvetica", "bold");
    doc.text("सुरक्षा नोट / Security Notice:", margin + 4, yPos + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 60, 0);
    const securityText = "यह रसीद केवल आपके व्यक्तिगत रिकॉर्ड के लिए है। यह आधिकारिक मतदान प्रमाण नहीं है।";
    doc.text(securityText, margin + 4, yPos + 13);
    doc.text("This receipt is for your personal records only. It is not official voting proof.", margin + 4, yPos + 19);
    
    yPos += 32;
    
    // ==================== FOOTER ====================
    // Bottom bar
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 30, pageWidth, 30, "F");
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("भारत निर्वाचन आयोग | Election Commission of India", pageWidth / 2, pageHeight - 22, { align: "center" });
    doc.text("निर्वाचन सदन, अशोक रोड, नई दिल्ली - 110001", pageWidth / 2, pageHeight - 17, { align: "center" });
    doc.text("www.eci.gov.in | ElectVote Platform", pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text("Certificate No. 1950", pageWidth / 2, pageHeight - 7, { align: "center" });
    
    // Watermark (subtle)
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    doc.text("ELECTVOTE", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
    
    // Generate filename and save
    const fileName = `vote-receipt-${data.transactionId}.pdf`;
    doc.save(fileName);
    
    console.log(`✓ Vote receipt generated: ${fileName}`);
  } catch (error) {
    console.error("Error generating vote receipt:", error);
    throw new Error("Failed to generate vote receipt PDF");
  }
}
