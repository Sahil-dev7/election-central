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
  
  // Header - Government Style
  doc.setFillColor(27, 38, 59); // Navy blue
  doc.rect(0, 0, pageWidth, 45, "F");
  
  // Ashoka Chakra approximation (circle with lines)
  doc.setDrawColor(255, 193, 7); // Gold
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, 20, 8);
  doc.setFontSize(8);
  doc.setTextColor(255, 193, 7);
  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const x1 = pageWidth / 2 + 5 * Math.cos(angle);
    const y1 = 20 + 5 * Math.sin(angle);
    const x2 = pageWidth / 2 + 8 * Math.cos(angle);
    const y2 = 20 + 8 * Math.sin(angle);
    doc.line(x1, y1, x2, y2);
  }
  
  // Title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("भारत निर्वाचन आयोग", pageWidth / 2, 35, { align: "center" });
  doc.setFontSize(10);
  doc.text("Election Commission of India", pageWidth / 2, 41, { align: "center" });
  
  // Receipt Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("मतदान रसीद / Vote Receipt", pageWidth / 2, 60, { align: "center" });
  
  // Success Badge
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(pageWidth / 2 - 30, 65, 60, 12, 3, 3, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("✓ मतदान सफल / Vote Confirmed", pageWidth / 2, 73, { align: "center" });
  
  // Transaction ID
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Transaction ID: ${data.transactionId}`, pageWidth / 2, 85, { align: "center" });
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 92, pageWidth - 20, 92);
  
  // Details Section
  let yPos = 105;
  const leftCol = 25;
  const rightCol = 90;
  
  const addRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(label, leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(value, rightCol, yPos);
    yPos += 12;
  };
  
  addRow("मतदाता / Voter:", data.voterName);
  addRow("मतदाता ID / Voter ID:", data.voterId);
  addRow("चुनाव / Election:", data.electionTitle);
  addRow("उम्मीदवार / Candidate:", data.candidateName);
  addRow("दल / Party:", data.candidateParty);
  addRow("दिनांक / Date:", data.timestamp.toLocaleDateString("hi-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }));
  addRow("समय / Time:", data.timestamp.toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }));
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos + 5, pageWidth - 20, yPos + 5);
  
  // Security Notice Box
  yPos += 20;
  doc.setFillColor(254, 243, 199); // Amber light
  doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, "F");
  doc.setDrawColor(245, 158, 11); // Amber
  doc.setLineWidth(0.5);
  doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, "S");
  
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.setFont("helvetica", "bold");
  doc.text("सुरक्षा नोट / Security Notice:", 25, yPos + 10);
  doc.setFont("helvetica", "normal");
  doc.text("यह रसीद केवल आपके रिकॉर्ड के लिए है।", 25, yPos + 20);
  doc.text("This receipt is for your records only.", 25, yPos + 28);
  
  // Footer
  yPos += 50;
  doc.setFillColor(240, 240, 240);
  doc.rect(0, yPos, pageWidth, 40, "F");
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("भारत निर्वाचन आयोग | Election Commission of India", pageWidth / 2, yPos + 12, { align: "center" });
  doc.text("निर्वाचन सदन, अशोक रोड, नई दिल्ली - 110001", pageWidth / 2, yPos + 20, { align: "center" });
  doc.text("www.eci.gov.in | 1950", pageWidth / 2, yPos + 28, { align: "center" });
  
  // Watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(60);
  doc.setFont("helvetica", "bold");
  doc.text("ELECTVOTE", pageWidth / 2, 150, { align: "center", angle: 45 });
  
  // Save PDF
  const fileName = `vote-receipt-${data.transactionId}.pdf`;
  doc.save(fileName);
}
