import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.news": "News",
    "nav.security": "Security",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.login": "Login",
    
    // Hero section
    "hero.trusted": "Trusted by 150+ Organizations",
    "hero.future": "Future",
    "hero.democratic": "The",
    "hero.voting": "of Democratic Voting",
    "hero.description": "Secure, transparent, and accessible online voting for elections of any scale.",
    "hero.voteNow": "Vote Now",
    "hero.signInBtn": "Sign In",
    
    // Trust badges
    "trust.encryption": "256-bit Encryption",
    "trust.gdpr": "GDPR Compliant",
    "trust.verified": "Verified Votes",
    
    // Stats
    "stats.votesCast": "Votes Cast",
    "stats.elections": "Elections",
    "stats.uptime": "Uptime",
    "stats.organizations": "Organizations",
    
    // Features
    "features.title": "Why Choose ElectVote?",
    "features.subtitle": "Enterprise-grade security meets user-friendly design for elections you can trust.",
    "features.security.title": "Bank-Level Security",
    "features.security.desc": "End-to-end encryption and blockchain-verified vote records ensure complete integrity.",
    "features.identity.title": "Verified Identity",
    "features.identity.desc": "Multi-factor authentication ensures only eligible voters can participate.",
    "features.results.title": "Live Results",
    "features.results.desc": "Watch real-time vote counts and analytics during elections.",
    "features.anywhere.title": "Vote From Anywhere",
    "features.anywhere.desc": "Cast your vote securely from any device, anywhere in the world.",
    
    // News section
    "news.badge": "News & Updates",
    "news.title": "Election News & Highlights",
    "news.subtitle": "Latest news from Election Commission and electoral process",
    "news.demo": "Sample News - For Demonstration Only",
    "news.read": "Read",
    
    // CTA
    "cta.title": "Ready to Transform Your Elections?",
    "cta.subtitle": "Thousands of organizations are already using ElectVote for secure, transparent voting.",
    "cta.free": "Start Free",
    "cta.contact": "Contact Us",
    
    // Footer
    "footer.rights": "© 2025 ElectVote. All rights reserved. Secure voting for everyone.",
    
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
    "general.tagline": "Your Vote Matters",
  },
  hi: {
    // Navigation
    "nav.features": "विशेषताएं",
    "nav.news": "समाचार",
    "nav.security": "सुरक्षा",
    "nav.signIn": "साइन इन",
    "nav.getStarted": "शुरू करें",
    "nav.login": "लॉगिन",
    
    // Hero section
    "hero.trusted": "150+ संगठनों द्वारा विश्वसनीय",
    "hero.future": "भविष्य",
    "hero.democratic": "लोकतांत्रिक मतदान का",
    "hero.voting": "",
    "hero.description": "किसी भी पैमाने के चुनावों के लिए सुरक्षित, पारदर्शी और सुलभ ऑनलाइन मतदान।",
    "hero.voteNow": "अभी वोट करें",
    "hero.signInBtn": "साइन इन करें",
    
    // Trust badges
    "trust.encryption": "256-बिट एन्क्रिप्शन",
    "trust.gdpr": "GDPR अनुपालन",
    "trust.verified": "सत्यापित वोट",
    
    // Stats
    "stats.votesCast": "वोट डाले गए",
    "stats.elections": "चुनाव",
    "stats.uptime": "अपटाइम",
    "stats.organizations": "संगठन",
    
    // Features
    "features.title": "ElectVote क्यों चुनें?",
    "features.subtitle": "एंटरप्राइज-ग्रेड सुरक्षा उपयोगकर्ता-अनुकूल डिज़ाइन से मिलती है।",
    "features.security.title": "बैंक-स्तरीय सुरक्षा",
    "features.security.desc": "एंड-टू-एंड एन्क्रिप्शन और ब्लॉकचेन-सत्यापित वोट रिकॉर्ड।",
    "features.identity.title": "सत्यापित पहचान",
    "features.identity.desc": "मल्टी-फैक्टर प्रमाणीकरण सुनिश्चित करता है कि केवल पात्र मतदाता भाग लें।",
    "features.results.title": "लाइव परिणाम",
    "features.results.desc": "चुनाव के दौरान वास्तविक समय में मतगणना देखें।",
    "features.anywhere.title": "कहीं से भी वोट करें",
    "features.anywhere.desc": "किसी भी डिवाइस से, दुनिया में कहीं से भी सुरक्षित रूप से वोट करें।",
    
    // News section
    "news.badge": "समाचार एवं अपडेट",
    "news.title": "चुनाव समाचार और हाइलाइट्स",
    "news.subtitle": "भारत निर्वाचन आयोग और चुनावी प्रक्रिया से जुड़ी ताज़ा खबरें",
    "news.demo": "नमूना समाचार - केवल प्रदर्शन हेतु",
    "news.read": "पढ़ें",
    
    // CTA
    "cta.title": "अपने चुनावों को बदलने के लिए तैयार हैं?",
    "cta.subtitle": "हजारों संगठन पहले से ही सुरक्षित, पारदर्शी मतदान के लिए ElectVote का उपयोग कर रहे हैं।",
    "cta.free": "मुफ्त शुरू करें",
    "cta.contact": "संपर्क करें",
    
    // Footer
    "footer.rights": "© 2025 ElectVote. सर्वाधिकार सुरक्षित। सभी के लिए सुरक्षित मतदान।",
    
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
    "general.tagline": "आपका वोट मायने रखता है",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("hi");

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
