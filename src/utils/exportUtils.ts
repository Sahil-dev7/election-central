import jsPDF from "jspdf";

interface Candidate {
  id: string;
  name: string;
  party: string;
  voteCount: number;
  status: string;
  constituency: string;
}

interface Election {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  voterCount: number;
  votesCast: number;
  status: string;
}

// Export results as CSV
export function exportResultsCSV(candidates: Candidate[], election: Election): void {
  const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
  
  // CSV Header
  let csv = "Rank,Candidate Name,Party,Constituency,Votes,Vote Percentage,Status\n";
  
  // Sort candidates by vote count
  const sortedCandidates = [...candidates]
    .filter(c => c.status === "approved")
    .sort((a, b) => b.voteCount - a.voteCount);
  
  // Add rows
  sortedCandidates.forEach((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : "0.00";
    const status = index === 0 ? "Winner" : "Candidate";
    csv += `${index + 1},"${candidate.name}","${candidate.party}","${candidate.constituency}",${candidate.voteCount},${percentage}%,${status}\n`;
  });
  
  // Add summary
  csv += "\n\nElection Summary\n";
  csv += `Election Name,"${election.title}"\n`;
  csv += `Start Date,${election.startDate}\n`;
  csv += `End Date,${election.endDate}\n`;
  csv += `Total Registered Voters,${election.voterCount}\n`;
  csv += `Total Votes Cast,${election.votesCast}\n`;
  csv += `Voter Turnout,${election.voterCount > 0 ? ((election.votesCast / election.voterCount) * 100).toFixed(2) : 0}%\n`;
  csv += `Status,${election.status}\n`;
  
  // Download CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `election-results-${election.id}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Export results as PDF
export function exportResultsPDF(candidates: Candidate[], election: Election): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
  
  // Header
  doc.setFillColor(27, 38, 59);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("ELECTION RESULTS REPORT", pageWidth / 2, 18, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(election.title, pageWidth / 2, 28, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 36, { align: "center" });
  
  // Election Summary Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 50, pageWidth - 30, 35, 3, 3, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(27, 38, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Election Summary", 20, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Period: ${election.startDate} - ${election.endDate}`, 20, 70);
  doc.text(`Total Voters: ${election.voterCount.toLocaleString()}`, 20, 78);
  doc.text(`Votes Cast: ${election.votesCast.toLocaleString()}`, 110, 70);
  doc.text(`Turnout: ${election.voterCount > 0 ? ((election.votesCast / election.voterCount) * 100).toFixed(1) : 0}%`, 110, 78);
  
  // Results Table Header
  let yPos = 100;
  doc.setFillColor(27, 38, 59);
  doc.rect(15, yPos, pageWidth - 30, 10, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Rank", 20, yPos + 7);
  doc.text("Candidate", 40, yPos + 7);
  doc.text("Party", 100, yPos + 7);
  doc.text("Votes", 150, yPos + 7);
  doc.text("%", 180, yPos + 7);
  
  // Sort and add candidate rows
  yPos += 15;
  const sortedCandidates = [...candidates]
    .filter(c => c.status === "approved")
    .sort((a, b) => b.voteCount - a.voteCount);
  
  sortedCandidates.forEach((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : "0.0";
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos - 5, pageWidth - 30, 10, "F");
    }
    
    // Winner highlight
    if (index === 0) {
      doc.setFillColor(254, 249, 195);
      doc.rect(15, yPos - 5, pageWidth - 30, 10, "F");
    }
    
    doc.setTextColor(27, 38, 59);
    doc.setFont("helvetica", index === 0 ? "bold" : "normal");
    doc.setFontSize(9);
    
    doc.text(`${index + 1}${index === 0 ? " 🏆" : ""}`, 20, yPos);
    doc.text(candidate.name.substring(0, 25), 40, yPos);
    doc.text(candidate.party.substring(0, 20), 100, yPos);
    doc.text(candidate.voteCount.toLocaleString(), 150, yPos);
    doc.text(`${percentage}%`, 180, yPos);
    
    yPos += 10;
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("ElectVote - Official Election Results", pageWidth / 2, footerY, { align: "center" });
  doc.text("This is a computer-generated document.", pageWidth / 2, footerY + 6, { align: "center" });
  
  // Save PDF
  doc.save(`election-results-${election.id}-${new Date().toISOString().split("T")[0]}.pdf`);
}

// Export voter data (for admin)
export function exportVoterDataCSV(voters: { id: string; name: string; email: string; status: string; votedIn: number }[]): void {
  let csv = "ID,Name,Email,Status,Elections Voted In\n";
  
  voters.forEach(voter => {
    csv += `${voter.id},"${voter.name}","${voter.email}",${voter.status},${voter.votedIn}\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `voter-data-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Export audit logs
export function exportAuditLogsCSV(logs: { action: string; user: string; details: string; timestamp: string; severity: string }[]): void {
  let csv = "Timestamp,Action,User,Details,Severity\n";
  
  logs.forEach(log => {
    csv += `"${log.timestamp}","${log.action}","${log.user}","${log.details}",${log.severity}\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
