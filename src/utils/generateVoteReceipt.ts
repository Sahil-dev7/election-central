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
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header - Navy Blue Government Style
  doc.setFillColor(27, 38, 59);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  // Ashoka Chakra Circle
  doc.setDrawColor(255, 193, 7);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, 22, 10);
  
  // Spokes of Ashoka Chakra
  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const x1 = pageWidth / 2 + 6 * Math.cos(angle);
    const y1 = 22 + 6 * Math.sin(angle);
    const x2 = pageWidth / 2 + 10 * Math.cos(angle);
    const y2 = 22 + 10 * Math.sin(angle);
    doc.line(x1, y1, x2, y2);
  }
  
  // Title - Hindi
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("ELECTVOTE - VOTING RECEIPT", pageWidth / 2, 40, { align: "center" });
  doc.setFontSize(10);
  doc.text("Election Commission of India", pageWidth / 2, 47, { align: "center" });
  
  // Decorative line under header
  doc.setDrawColor(255, 193, 7);
  doc.setLineWidth(2);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // Receipt Title
  doc.setTextColor(27, 38, 59);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL VOTE CONFIRMATION", pageWidth / 2, 70, { align: "center" });
  
  // Success Badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth / 2 - 35, 76, 70, 14, 4, 4, "F");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("VOTE SUCCESSFULLY RECORDED", pageWidth / 2, 85, { align: "center" });
  
  // Transaction ID Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(30, 98, pageWidth - 60, 16, 3, 3, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Transaction ID:", 40, 108);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 38, 59);
  doc.text(data.transactionId, pageWidth - 40, 108, { align: "right" });
  
  // Details Section
  let yPos = 130;
  const leftCol = 30;
  const rightCol = 100;
  
  const addDetailRow = (label: string, value: string, isImportant: boolean = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(label, leftCol, yPos);
    
    doc.setFont("helvetica", isImportant ? "bold" : "normal");
    doc.setTextColor(27, 38, 59);
    
    // Handle long text
    const maxWidth = pageWidth - rightCol - 20;
    const splitText = doc.splitTextToSize(value, maxWidth);
    doc.text(splitText, rightCol, yPos);
    
    yPos += 14 + (splitText.length - 1) * 5;
  };
  
  addDetailRow("Voter Name:", data.voterName, true);
  addDetailRow("Voter ID:", data.voterId);
  addDetailRow("Election:", data.electionTitle, true);
  addDetailRow("Candidate Voted:", data.candidateName, true);
  addDetailRow("Party:", data.candidateParty);
  addDetailRow("Date:", data.timestamp.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }));
  addDetailRow("Time:", data.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }));
  
  // Divider
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(30, yPos, pageWidth - 30, yPos);
  
  // Security Notice Box
  yPos += 15;
  doc.setFillColor(254, 249, 195);
  doc.roundedRect(25, yPos, pageWidth - 50, 45, 4, 4, "F");
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(1);
  doc.roundedRect(25, yPos, pageWidth - 50, 45, 4, 4, "S");
  
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.setFont("helvetica", "bold");
  doc.text("IMPORTANT NOTICE", 32, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const noticeText = [
    "1. This receipt confirms your vote has been securely recorded.",
    "2. Keep this receipt for your personal records only.",
    "3. Your vote is anonymous and cannot be traced back to you.",
    "4. For any queries, contact your local election office.",
  ];
  noticeText.forEach((line, i) => {
    doc.text(line, 32, yPos + 22 + i * 6);
  });
  
  // Footer
  const footerY = pageHeight - 35;
  doc.setFillColor(27, 38, 59);
  doc.rect(0, footerY, pageWidth, 35, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("ElectVote - Secure Digital Voting Platform", pageWidth / 2, footerY + 10, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Election Commission of India", pageWidth / 2, footerY + 18, { align: "center" });
  doc.text("Nirvachan Sadan, Ashoka Road, New Delhi - 110001", pageWidth / 2, footerY + 25, { align: "center" });
  doc.text("www.eci.gov.in | Helpline: 1950", pageWidth / 2, footerY + 32, { align: "center" });
  
  // Watermark (light)
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(50);
  doc.setFont("helvetica", "bold");
  doc.text("ELECTVOTE", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
  
  // QR Code placeholder - just a box with text
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth - 50, 98, 30, 30, "F");
  doc.setDrawColor(27, 38, 59);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - 50, 98, 30, 30, "S");
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text("SCAN TO", pageWidth - 35, 110, { align: "center" });
  doc.text("VERIFY", pageWidth - 35, 115, { align: "center" });
  
  // Save PDF
  const fileName = `ElectVote-Receipt-${data.transactionId}.pdf`;
  doc.save(fileName);
}
