import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Greetings
    "greeting.morning": "Good Morning",
    "greeting.afternoon": "Good Afternoon",
    "greeting.evening": "Good Evening",
    "greeting.welcome": "Welcome to ElectVote",
    "greeting.thankyou": "Thank you for voting! View the live results below.",
    "greeting.available": "active election available. Your vote matters - make it count!",
    
    // Dashboard
    "dashboard.castVote": "Cast Your Vote",
    "dashboard.electionInfo": "Election Info",
    "dashboard.activeElections": "Active Elections",
    "dashboard.yourVotesCast": "Your Votes Cast",
    "dashboard.totalCandidates": "Total Candidates",
    "dashboard.currentTurnout": "Current Turnout",
    "dashboard.thisYear": "This year",
    "dashboard.inCurrentElection": "In current election",
    "dashboard.upcoming": "upcoming",
    "dashboard.viewAll": "View All",
    "dashboard.selectCandidate": "Select your candidate",
    "dashboard.voteSubmitted": "Vote Submitted",
    "dashboard.selectStep": "Select Candidate",
    "dashboard.reviewStep": "Review Choice",
    "dashboard.confirmStep": "Confirm Vote",
    "dashboard.liveResults": "Live Results",
    "dashboard.votingHistory": "Your Voting History",
    "dashboard.verified": "Verified",
    "dashboard.votedFor": "Voted for",
    "dashboard.refresh": "Refresh",
    "dashboard.lastUpdated": "Last updated: Just now",
    "dashboard.totalVotes": "Total votes",
    "dashboard.votes": "Votes",
    "dashboard.confirmVoteFor": "Confirm Vote for",
    "dashboard.viewResults": "View Live Results",
    "dashboard.thanksForVoting": "Thank You for Voting!",
    
    // Candidate
    "candidate.selected": "Selected",
    "candidate.selectCandidate": "Select Candidate",
    
    // Elections
    "election.municipal2025": "2025 Municipal Elections",
    "election.studentUnion": "Student Union Elections 2025",
    "election.panchayat": "Panchayat Elections 2024",
    
    // General
    "general.user": "User",
    "general.votes": "votes",
  },
  hi: {
    // Greetings
    "greeting.morning": "सुप्रभात",
    "greeting.afternoon": "नमस्कार",
    "greeting.evening": "शुभ संध्या",
    "greeting.welcome": "ElectVote में आपका स्वागत है",
    "greeting.thankyou": "मतदान के लिए धन्यवाद! नीचे लाइव परिणाम देखें।",
    "greeting.available": "सक्रिय चुनाव उपलब्ध है। आपका वोट मायने रखता है!",
    
    // Dashboard
    "dashboard.castVote": "अपना वोट डालें",
    "dashboard.electionInfo": "चुनाव जानकारी",
    "dashboard.activeElections": "सक्रिय चुनाव",
    "dashboard.yourVotesCast": "आपके वोट",
    "dashboard.totalCandidates": "कुल उम्मीदवार",
    "dashboard.currentTurnout": "वर्तमान मतदान",
    "dashboard.thisYear": "इस वर्ष",
    "dashboard.inCurrentElection": "वर्तमान चुनाव में",
    "dashboard.upcoming": "आगामी",
    "dashboard.viewAll": "सभी देखें",
    "dashboard.selectCandidate": "अपना उम्मीदवार चुनें",
    "dashboard.voteSubmitted": "वोट दर्ज हुआ",
    "dashboard.selectStep": "उम्मीदवार चुनें",
    "dashboard.reviewStep": "समीक्षा करें",
    "dashboard.confirmStep": "पुष्टि करें",
    "dashboard.liveResults": "लाइव परिणाम",
    "dashboard.votingHistory": "आपका मतदान इतिहास",
    "dashboard.verified": "सत्यापित",
    "dashboard.votedFor": "के लिए मतदान किया",
    "dashboard.refresh": "रिफ्रेश",
    "dashboard.lastUpdated": "अंतिम अपडेट: अभी",
    "dashboard.totalVotes": "कुल वोट",
    "dashboard.votes": "वोट",
    "dashboard.confirmVoteFor": "के लिए वोट पुष्टि करें",
    "dashboard.viewResults": "लाइव परिणाम देखें",
    "dashboard.thanksForVoting": "मतदान के लिए धन्यवाद!",
    
    // Candidate
    "candidate.selected": "चयनित",
    "candidate.selectCandidate": "उम्मीदवार चुनें",
    
    // Elections
    "election.municipal2025": "2025 नगर निगम चुनाव",
    "election.studentUnion": "छात्र संघ चुनाव 2025",
    "election.panchayat": "पंचायत चुनाव 2024",
    
    // General
    "general.user": "उपयोगकर्ता",
    "general.votes": "वोट",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
