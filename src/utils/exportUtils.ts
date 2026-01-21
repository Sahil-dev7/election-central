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

// HTML escape to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

// Export results as printable HTML (replaces vulnerable jspdf)
export function exportResultsPDF(candidates: Candidate[], election: Election): void {
  const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
  
  const sortedCandidates = [...candidates]
    .filter(c => c.status === "approved")
    .sort((a, b) => b.voteCount - a.voteCount);

  const candidateRows = sortedCandidates.map((candidate, index) => {
    const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : "0.0";
    const isWinner = index === 0;
    return `
      <tr class="${isWinner ? 'winner' : ''} ${index % 2 === 0 ? 'even' : ''}">
        <td>${index + 1}${isWinner ? ' 🏆' : ''}</td>
        <td>${escapeHtml(candidate.name)}</td>
        <td>${escapeHtml(candidate.party)}</td>
        <td>${candidate.voteCount.toLocaleString()}</td>
        <td>${percentage}%</td>
      </tr>
    `;
  }).join('');

  const turnout = election.voterCount > 0 
    ? ((election.votesCast / election.voterCount) * 100).toFixed(1) 
    : '0';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Election Results - ${escapeHtml(election.title)}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .report {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: #1b263b;
      color: white;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 20px;
      margin-bottom: 8px;
    }
    .header h2 {
      font-size: 14px;
      font-weight: normal;
      opacity: 0.9;
    }
    .header .timestamp {
      font-size: 11px;
      margin-top: 8px;
      opacity: 0.8;
    }
    .summary {
      background: #f1f5f9;
      padding: 20px 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-item label {
      display: block;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .summary-item value {
      display: block;
      font-size: 18px;
      font-weight: 600;
      color: #1b263b;
    }
    .content {
      padding: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #1b263b;
      color: white;
      padding: 10px 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      font-size: 13px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr.even {
      background: #f8fafc;
    }
    tr.winner {
      background: #fef9c3 !important;
      font-weight: 600;
    }
    .footer {
      background: #f8fafc;
      padding: 16px 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 11px;
      color: #64748b;
    }
    .print-btn {
      display: block;
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      padding: 12px;
      background: #1b263b;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }
    .print-btn:hover {
      background: #2d3a52;
    }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <h1>ELECTION RESULTS REPORT</h1>
      <h2>${escapeHtml(election.title)}</h2>
      <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
    </div>
    <div class="summary">
      <div class="summary-item">
        <label>Period</label>
        <value>${escapeHtml(election.startDate)} - ${escapeHtml(election.endDate)}</value>
      </div>
      <div class="summary-item">
        <label>Total Voters</label>
        <value>${election.voterCount.toLocaleString()}</value>
      </div>
      <div class="summary-item">
        <label>Votes Cast</label>
        <value>${election.votesCast.toLocaleString()}</value>
      </div>
      <div class="summary-item">
        <label>Turnout</label>
        <value>${turnout}%</value>
      </div>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Candidate</th>
            <th>Party</th>
            <th>Votes</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          ${candidateRows}
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p><strong>ElectVote - Official Election Results</strong></p>
      <p>This is a computer-generated document.</p>
    </div>
  </div>
  <button class="print-btn no-print" onclick="window.print(); return false;">🖨️ Print / Save as PDF</button>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
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
