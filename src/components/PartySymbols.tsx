import React from "react";

// BJP Lotus Symbol
export function BJPLotus({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Lotus petals - saffron/orange */}
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(30 50 50)" />
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(90 50 50)" />
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(120 50 50)" />
      <ellipse cx="50" cy="35" rx="12" ry="25" fill="#FF6B00" transform="rotate(150 50 50)" />
      {/* Center */}
      <circle cx="50" cy="50" r="15" fill="#FF9933" />
      <circle cx="50" cy="50" r="8" fill="#FFD700" />
    </svg>
  );
}

// Congress Hand Symbol
export function CongressHand({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Hand palm */}
      <path
        d="M50 15 L50 35 M35 25 L35 45 M65 25 L65 45 M25 35 L25 55 M75 35 L75 55"
        stroke="#1E88E5"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Palm base */}
      <ellipse cx="50" cy="70" rx="35" ry="25" fill="#1E88E5" />
      {/* Finger tips */}
      <circle cx="50" cy="15" r="6" fill="#1E88E5" />
      <circle cx="35" cy="22" r="6" fill="#1E88E5" />
      <circle cx="65" cy="22" r="6" fill="#1E88E5" />
      <circle cx="25" cy="32" r="5" fill="#1E88E5" />
      <circle cx="75" cy="32" r="5" fill="#1E88E5" />
    </svg>
  );
}

// AAP Broom Symbol
export function AAPBroom({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Broom handle */}
      <rect x="47" y="5" width="6" height="50" fill="#8B4513" rx="2" />
      {/* Broom binding */}
      <rect x="40" y="52" width="20" height="8" fill="#228B22" rx="2" />
      {/* Broom bristles */}
      <path
        d="M30 60 Q35 75 25 95 M35 60 Q38 75 32 95 M40 60 Q42 78 38 95 M45 60 Q46 80 45 95 M50 60 Q50 82 50 95 M55 60 Q54 80 55 95 M60 60 Q58 78 62 95 M65 60 Q62 75 68 95 M70 60 Q65 75 75 95"
        stroke="#228B22"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Generic Party Symbol Component
export function PartySymbol({ party, className = "w-8 h-8" }: { party: string; className?: string }) {
  const partyLower = party.toLowerCase();
  
  if (partyLower.includes("bjp") || partyLower.includes("bharatiya janata")) {
    return <BJPLotus className={className} />;
  }
  if (partyLower.includes("congress") || partyLower.includes("inc")) {
    return <CongressHand className={className} />;
  }
  if (partyLower.includes("aap") || partyLower.includes("aam aadmi")) {
    return <AAPBroom className={className} />;
  }
  
  // Default symbol - ballot box
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="20" y="30" width="60" height="50" fill="#6B7280" rx="5" />
      <rect x="35" y="25" width="30" height="10" fill="#9CA3AF" rx="2" />
      <rect x="40" y="45" width="20" height="5" fill="#E5E7EB" rx="1" />
    </svg>
  );
}
