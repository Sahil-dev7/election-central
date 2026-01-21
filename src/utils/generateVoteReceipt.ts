interface VoteReceiptData {
  voterName: string;
  voterId: string;
  electionTitle: string;
  candidateName: string;
  candidateParty: string;
  timestamp: Date;
  transactionId: string;
}

// Generate receipt as printable HTML instead of using vulnerable jspdf library
export function generateVoteReceipt(data: VoteReceiptData): void {
  const dateStr = data.timestamp.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const timeStr = data.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vote Receipt - ${data.transactionId}</title>
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
    .receipt {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #1b263b;
      color: white;
      padding: 24px;
      text-align: center;
    }
    .chakra {
      width: 60px;
      height: 60px;
      margin: 0 auto 12px;
      border: 3px solid #ffc107;
      border-radius: 50%;
      position: relative;
    }
    .chakra::before {
      content: '☸';
      font-size: 36px;
      color: #ffc107;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .header h1 {
      font-size: 18px;
      margin-bottom: 4px;
      letter-spacing: 1px;
    }
    .header p {
      font-size: 12px;
      opacity: 0.9;
    }
    .divider {
      height: 3px;
      background: linear-gradient(90deg, #ff9933, white, #138808);
    }
    .content {
      padding: 24px;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
    }
    .title h2 {
      color: #1b263b;
      font-size: 20px;
      margin-bottom: 8px;
    }
    .success-badge {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .transaction-box {
      background: #f1f5f9;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .transaction-box label {
      color: #64748b;
      font-size: 13px;
    }
    .transaction-box strong {
      color: #1b263b;
      font-family: monospace;
      font-size: 14px;
    }
    .details {
      margin-bottom: 20px;
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #64748b;
      width: 140px;
      flex-shrink: 0;
      font-size: 14px;
    }
    .detail-value {
      color: #1b263b;
      font-size: 14px;
    }
    .detail-value.important {
      font-weight: 600;
    }
    .notice {
      background: #fef9c3;
      border: 1px solid #eab308;
      border-radius: 6px;
      padding: 16px;
      margin-top: 20px;
    }
    .notice h3 {
      color: #92400e;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .notice ol {
      color: #92400e;
      font-size: 12px;
      padding-left: 20px;
      line-height: 1.6;
    }
    .footer {
      background: #1b263b;
      color: white;
      padding: 16px;
      text-align: center;
    }
    .footer p {
      font-size: 11px;
      opacity: 0.9;
      line-height: 1.5;
    }
    .print-btn {
      display: block;
      width: 100%;
      max-width: 600px;
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
  <div class="receipt">
    <div class="header">
      <div class="chakra"></div>
      <h1>ELECTVOTE - VOTING RECEIPT</h1>
      <p>Election Commission of India</p>
    </div>
    <div class="divider"></div>
    <div class="content">
      <div class="title">
        <h2>OFFICIAL VOTE CONFIRMATION</h2>
        <span class="success-badge">✓ VOTE SUCCESSFULLY RECORDED</span>
      </div>
      <div class="transaction-box">
        <label>Transaction ID:</label>
        <strong>${escapeHtml(data.transactionId)}</strong>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Voter Name:</span>
          <span class="detail-value important">${escapeHtml(data.voterName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Voter ID:</span>
          <span class="detail-value">${escapeHtml(data.voterId)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Election:</span>
          <span class="detail-value important">${escapeHtml(data.electionTitle)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Candidate Voted:</span>
          <span class="detail-value important">${escapeHtml(data.candidateName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Party:</span>
          <span class="detail-value">${escapeHtml(data.candidateParty)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${escapeHtml(dateStr)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">${escapeHtml(timeStr)}</span>
        </div>
      </div>
      <div class="notice">
        <h3>IMPORTANT NOTICE</h3>
        <ol>
          <li>This receipt confirms your vote has been securely recorded.</li>
          <li>Keep this receipt for your personal records only.</li>
          <li>Your vote is anonymous and cannot be traced back to you.</li>
          <li>For any queries, contact your local election office.</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      <p><strong>ElectVote - Secure Digital Voting Platform</strong></p>
      <p>Election Commission of India<br>
      Nirvachan Sadan, Ashoka Road, New Delhi - 110001<br>
      www.eci.gov.in | Helpline: 1950</p>
    </div>
  </div>
  <button class="print-btn no-print" onclick="window.print(); return false;">🖨️ Print / Save as PDF</button>
  <script>
    // Auto-trigger print dialog
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

// HTML escape to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
