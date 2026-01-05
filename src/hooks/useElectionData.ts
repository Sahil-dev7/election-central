import { useState, useEffect, useCallback } from "react";

// Import politician images
import narendraModiImg from "@/assets/narendra-modi.jpg";
import yogiAdityanathImg from "@/assets/yogi-adityanath.jpg";
import arvindKejriwalImg from "@/assets/arvind-kejriwal.jpg";
import madhuVermaImg from "@/assets/madhu-verma.jpg";
import shankarLalwaniImg from "@/assets/shankar-lalwani.jpg";
import mamataBanerjeeImg from "@/assets/mamata-banerjee.jpg";
import nirmalaSitharamanImg from "@/assets/nirmala-sitharaman.jpg";
import rahulGandhiImg from "@/assets/rahul-gandhi.jpg";
import amitShahImg from "@/assets/amit-shah.jpg";

export interface Candidate {
  id: string;
  name: string;
  nameHi: string;
  party: string;
  partyHi: string;
  photo: string;
  manifesto: string;
  manifestoHi: string;
  voteCount: number;
  status: "approved" | "pending" | "rejected";
  constituency: string;
  constituencyHi: string;
}

export interface Election {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  startDate: string;
  endDate: string;
  candidateCount: number;
  voterCount: number;
  votesCast: number;
  status: "draft" | "active" | "paused" | "closed";
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "suspended";
  votedIn: number;
  lastActive: string;
}

export interface VoteHistory {
  election: string;
  date: string;
  candidate: string;
  status: "completed";
}

// Real Indian Politicians with AI-generated images
const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Narendra Modi",
    nameHi: "नरेन्द्र मोदी",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: narendraModiImg,
    manifesto: "Development, Digital India, Make in India, Clean India Mission",
    manifestoHi: "विकास, डिजिटल इंडिया, मेक इन इंडिया, स्वच्छ भारत अभियान",
    voteCount: 24500,
    status: "approved",
    constituency: "Varanasi, Uttar Pradesh",
    constituencyHi: "वाराणसी, उत्तर प्रदेश",
  },
  {
    id: "2",
    name: "Rahul Gandhi",
    nameHi: "राहुल गांधी",
    party: "Indian National Congress (INC)",
    partyHi: "भारतीय राष्ट्रीय कांग्रेस",
    photo: rahulGandhiImg,
    manifesto: "NYAY Scheme, Farm Loan Waiver, Employment Generation",
    manifestoHi: "न्याय योजना, किसान ऋण माफी, रोजगार सृजन",
    voteCount: 18200,
    status: "approved",
    constituency: "Raebareli, Uttar Pradesh",
    constituencyHi: "रायबरेली, उत्तर प्रदेश",
  },
  {
    id: "3",
    name: "Amit Shah",
    nameHi: "अमित शाह",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: amitShahImg,
    manifesto: "National Security, Law & Order, Citizenship Amendment",
    manifestoHi: "राष्ट्रीय सुरक्षा, कानून व्यवस्था, नागरिकता संशोधन",
    voteCount: 15800,
    status: "approved",
    constituency: "Gandhinagar, Gujarat",
    constituencyHi: "गांधीनगर, गुजरात",
  },
  {
    id: "4",
    name: "Yogi Adityanath",
    nameHi: "योगी आदित्यनाथ",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: yogiAdityanathImg,
    manifesto: "Law & Order, Infrastructure Development, UP Development",
    manifestoHi: "कानून व्यवस्था, बुनियादी ढांचा विकास, यूपी विकास",
    voteCount: 14200,
    status: "approved",
    constituency: "Gorakhpur, Uttar Pradesh",
    constituencyHi: "गोरखपुर, उत्तर प्रदेश",
  },
  {
    id: "5",
    name: "Arvind Kejriwal",
    nameHi: "अरविंद केजरीवाल",
    party: "Aam Aadmi Party (AAP)",
    partyHi: "आम आदमी पार्टी",
    photo: arvindKejriwalImg,
    manifesto: "Free Electricity, Free Water, Mohalla Clinics, Education",
    manifestoHi: "मुफ्त बिजली, मुफ्त पानी, मोहल्ला क्लीनिक, शिक्षा",
    voteCount: 12500,
    status: "approved",
    constituency: "New Delhi, Delhi",
    constituencyHi: "नई दिल्ली, दिल्ली",
  },
  {
    id: "6",
    name: "Mamata Banerjee",
    nameHi: "ममता बनर्जी",
    party: "All India Trinamool Congress",
    partyHi: "अखिल भारतीय तृणमूल कांग्रेस",
    photo: mamataBanerjeeImg,
    manifesto: "Bengal Development, Women Empowerment, Social Welfare",
    manifestoHi: "बंगाल विकास, महिला सशक्तिकरण, सामाजिक कल्याण",
    voteCount: 11800,
    status: "approved",
    constituency: "Kolkata, West Bengal",
    constituencyHi: "कोलकाता, पश्चिम बंगाल",
  },
  {
    id: "7",
    name: "Nirmala Sitharaman",
    nameHi: "निर्मला सीतारमण",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: nirmalaSitharamanImg,
    manifesto: "Economic Growth, Tax Reforms, Financial Inclusion",
    manifestoHi: "आर्थिक विकास, कर सुधार, वित्तीय समावेशन",
    voteCount: 10500,
    status: "approved",
    constituency: "Karnataka, South India",
    constituencyHi: "कर्नाटक, दक्षिण भारत",
  },
  {
    id: "8",
    name: "Madhu Verma",
    nameHi: "मधु वर्मा",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: madhuVermaImg,
    manifesto: "Local Development, Women Safety, Infrastructure",
    manifestoHi: "स्थानीय विकास, महिला सुरक्षा, बुनियादी ढांचा",
    voteCount: 8500,
    status: "approved",
    constituency: "Indore, Madhya Pradesh",
    constituencyHi: "इंदौर, मध्य प्रदेश",
  },
  {
    id: "9",
    name: "Shankar Lalwani",
    nameHi: "शंकर लालवानी",
    party: "Bharatiya Janata Party (BJP)",
    partyHi: "भारतीय जनता पार्टी (भाजपा)",
    photo: shankarLalwaniImg,
    manifesto: "Smart City Indore, Clean City, Business Growth",
    manifestoHi: "स्मार्ट सिटी इंदौर, स्वच्छ शहर, व्यापार विकास",
    voteCount: 9200,
    status: "approved",
    constituency: "Indore, Madhya Pradesh",
    constituencyHi: "इंदौर, मध्य प्रदेश",
  },
  {
    id: "10",
    name: "Swapnil Kothari",
    nameHi: "स्वप्निल कोठारी",
    party: "Indian National Congress (INC)",
    partyHi: "भारतीय राष्ट्रीय कांग्रेस",
    photo: "https://images.bhaskarassets.com/thumb/1200x900/web2images/521/2022/09/07/renaissance-730x548-1_1662533070.jpg",
    manifesto: "Youth Employment, Education Reform, Social Justice",
    manifestoHi: "युवा रोजगार, शिक्षा सुधार, सामाजिक न्याय",
    voteCount: 32000, // Winning by majority
    status: "approved",
    constituency: "Indore, Madhya Pradesh",
    constituencyHi: "इंदौर, मध्य प्रदेश",
  },
];

const initialElections: Election[] = [
  {
    id: "1",
    title: "Lok Sabha General Elections 2025",
    titleHi: "लोकसभा आम चुनाव 2025",
    description: "General Elections for Members of Parliament",
    descriptionHi: "संसद सदस्यों के लिए आम चुनाव",
    startDate: "Apr 15, 2025",
    endDate: "May 22, 2025",
    candidateCount: 10,
    voterCount: 96800000, // Fixed: ~9.68 crore voters
    votesCast: 28500000,
    status: "active",
  },
  {
    id: "2",
    title: "Madhya Pradesh Municipal Elections 2025",
    titleHi: "मध्य प्रदेश नगर निगम चुनाव 2025",
    description: "Municipal Corporation Elections for MP Cities",
    descriptionHi: "मध्य प्रदेश शहरों के लिए नगर निगम चुनाव",
    startDate: "Feb 5, 2025",
    endDate: "Feb 12, 2025",
    candidateCount: 6,
    voterCount: 45000,
    votesCast: 28450,
    status: "draft",
  },
  {
    id: "3",
    title: "UP Panchayat Elections 2024",
    titleHi: "यूपी पंचायत चुनाव 2024",
    description: "Panchayat Member Elections for UP",
    descriptionHi: "उत्तर प्रदेश पंचायत सदस्य चुनाव",
    startDate: "Oct 1, 2024",
    endDate: "Oct 8, 2024",
    candidateCount: 4,
    voterCount: 85000,
    votesCast: 72000,
    status: "closed",
  },
];

const initialVoters: Voter[] = [
  { id: "1", name: "राहुल वर्मा", email: "rahul@example.com", status: "active", votedIn: 3, lastActive: "2 min ago" },
  { id: "2", name: "प्रिया शर्मा", email: "priya@example.com", status: "active", votedIn: 2, lastActive: "1 hour ago" },
  { id: "3", name: "विक्रम सिंह", email: "vikram@example.com", status: "pending", votedIn: 0, lastActive: "Never" },
  { id: "4", name: "अनीता कुमारी", email: "anita@example.com", status: "suspended", votedIn: 1, lastActive: "3 days ago" },
  { id: "5", name: "सुरेश यादव", email: "suresh@example.com", status: "active", votedIn: 5, lastActive: "5 min ago" },
];

const initialVoteHistory: VoteHistory[] = [
  { election: "पंचायत चुनाव 2024", date: "Oct 8, 2024", candidate: "राजेश कुमार शर्मा", status: "completed" },
  { election: "वार्षिक आम सभा", date: "Sep 15, 2024", candidate: "अमित सिंह यादव", status: "completed" },
  { election: "समुदाय मतदान 2024", date: "Aug 20, 2024", candidate: "अरविंद कुमार गुप्ता", status: "completed" },
];

export function useElectionData() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [elections, setElections] = useState<Election[]>(initialElections);
  const [voters, setVoters] = useState<Voter[]>(initialVoters);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>(initialVoteHistory);
  const [userVote, setUserVote] = useState<{ electionId: string; candidateId: string } | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setCandidates(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((c, i) => 
          i === randomIndex && c.status === "approved" 
            ? { ...c, voteCount: c.voteCount + Math.floor(Math.random() * 5) + 1 }
            : c
        );
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const castVote = useCallback((electionId: string, candidateId: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
      )
    );
    setElections(prev =>
      prev.map(e =>
        e.id === electionId ? { ...e, votesCast: e.votesCast + 1 } : e
      )
    );
    setUserVote({ electionId, candidateId });
    
    const candidate = candidates.find(c => c.id === candidateId);
    const election = elections.find(e => e.id === electionId);
    if (candidate && election) {
      setVoteHistory(prev => [
        { election: election.title, date: new Date().toLocaleDateString(), candidate: candidate.name, status: "completed" },
        ...prev
      ]);
    }
  }, [candidates, elections]);

  const approveCandidate = useCallback((candidateId: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, status: "approved" } : c
      )
    );
  }, []);

  const rejectCandidate = useCallback((candidateId: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, status: "rejected" } : c
      )
    );
  }, []);

  const approveVoter = useCallback((voterId: string) => {
    setVoters(prev =>
      prev.map(v =>
        v.id === voterId ? { ...v, status: "active" } : v
      )
    );
  }, []);

  const suspendVoter = useCallback((voterId: string) => {
    setVoters(prev =>
      prev.map(v =>
        v.id === voterId ? { ...v, status: "suspended" } : v
      )
    );
  }, []);

  const updateElectionStatus = useCallback((electionId: string, status: Election["status"]) => {
    setElections(prev =>
      prev.map(e =>
        e.id === electionId ? { ...e, status } : e
      )
    );
  }, []);

  const addElection = useCallback((election: Omit<Election, "id" | "votesCast">) => {
    const newElection: Election = {
      ...election,
      id: Math.random().toString(36).substr(2, 9),
      votesCast: 0,
    };
    setElections(prev => [...prev, newElection]);
    return newElection;
  }, []);

  const addCandidate = useCallback((candidate: Omit<Candidate, "id" | "voteCount" | "status">) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Math.random().toString(36).substr(2, 9),
      voteCount: 0,
      status: "pending",
    };
    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  }, []);

  const getTotalVotes = useCallback(() => {
    return candidates.reduce((acc, c) => acc + c.voteCount, 0);
  }, [candidates]);

  const getVoterTurnout = useCallback((electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    if (!election || election.voterCount === 0) return 0;
    return Math.round((election.votesCast / election.voterCount) * 100);
  }, [elections]);

  return {
    candidates,
    elections,
    voters,
    voteHistory,
    userVote,
    isLiveUpdating,
    setIsLiveUpdating,
    castVote,
    approveCandidate,
    rejectCandidate,
    approveVoter,
    suspendVoter,
    updateElectionStatus,
    addElection,
    addCandidate,
    getTotalVotes,
    getVoterTurnout,
  };
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
