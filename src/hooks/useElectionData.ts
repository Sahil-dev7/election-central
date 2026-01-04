import { useState, useEffect, useCallback } from "react";

import politician1 from "@/assets/politician-1.jpg";
import politician2 from "@/assets/politician-2.jpg";
import politician3 from "@/assets/politician-3.jpg";
import politician4 from "@/assets/politician-4.jpg";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photo: string;
  manifesto: string;
  voteCount: number;
  status: "approved" | "pending" | "rejected";
}

export interface Election {
  id: string;
  title: string;
  description: string;
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

// Initial mock data with correct Indian political associations
const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Shri Ramesh Chandra Verma",
    party: "Bharatiya Janata Party (BJP)",
    photo: politician1,
    manifesto: "लखनऊ नगर निगम के विकास के लिए प्रतिबद्ध। स्वच्छता अभियान, सड़क निर्माण, और नागरिक सुविधाओं में सुधार।",
    voteCount: 12450,
    status: "approved",
  },
  {
    id: "2",
    name: "Shri Suresh Kumar Tripathi",
    party: "Bharatiya Janata Party (BJP)",
    photo: politician2,
    manifesto: "वाराणसी के विकास के लिए समर्पित। पर्यटन, रोजगार, और गंगा स्वच्छता अभियान को बढ़ावा।",
    voteCount: 9830,
    status: "approved",
  },
  {
    id: "3",
    name: "Shri Manoj Kumar Sharma",
    party: "Aam Aadmi Party (AAP)",
    photo: politician3,
    manifesto: "दिल्ली की जनता के लिए। मुफ्त बिजली-पानी, मोहल्ला क्लीनिक, और भ्रष्टाचार मुक्त प्रशासन।",
    voteCount: 4120,
    status: "approved",
  },
  {
    id: "4",
    name: "Smt. Kavita Kumari Singh",
    party: "Indian National Congress",
    photo: politician4,
    manifesto: "रायबरेली की जनता के साथ। किसानों की ऋण माफी, महिला सशक्तिकरण, और ग्रामीण विकास।",
    voteCount: 2050,
    status: "pending",
  },
];

const initialElections: Election[] = [
  {
    id: "1",
    title: "लखनऊ नगर निगम चुनाव 2025",
    description: "लखनऊ नगर निगम पार्षद और महापौर पद के लिए मतदान",
    startDate: "Jan 15, 2025",
    endDate: "Jan 22, 2025",
    candidateCount: 4,
    voterCount: 45000,
    votesCast: 28450,
    status: "active",
  },
  {
    id: "2",
    title: "दिल्ली विश्वविद्यालय छात्र संघ चुनाव 2025",
    description: "दिल्ली विश्वविद्यालय छात्र संघ अध्यक्ष का चुनाव",
    startDate: "Feb 5, 2025",
    endDate: "Feb 12, 2025",
    candidateCount: 6,
    voterCount: 12000,
    votesCast: 0,
    status: "draft",
  },
  {
    id: "3",
    title: "वाराणसी जिला पंचायत चुनाव 2024",
    description: "वाराणसी जिला पंचायत सदस्यों का चुनाव",
    startDate: "Oct 1, 2024",
    endDate: "Oct 8, 2024",
    candidateCount: 4,
    voterCount: 8500,
    votesCast: 7200,
    status: "closed",
  },
];

const initialVoters: Voter[] = [
  { id: "1", name: "Rahul Verma", email: "rahul@example.com", status: "active", votedIn: 3, lastActive: "2 min ago" },
  { id: "2", name: "Priya Sharma", email: "priya@example.com", status: "active", votedIn: 2, lastActive: "1 hour ago" },
  { id: "3", name: "Vikram Singh", email: "vikram@example.com", status: "pending", votedIn: 0, lastActive: "Never" },
  { id: "4", name: "Anita Kumari", email: "anita@example.com", status: "suspended", votedIn: 1, lastActive: "3 days ago" },
  { id: "5", name: "Suresh Yadav", email: "suresh@example.com", status: "active", votedIn: 5, lastActive: "5 min ago" },
];

const initialVoteHistory: VoteHistory[] = [
  { election: "पंचायत चुनाव 2024", date: "Oct 8, 2024", candidate: "Rajesh Kumar Sharma", status: "completed" },
  { election: "वार्षिक आम सभा", date: "Sep 15, 2024", candidate: "Amit Singh Yadav", status: "completed" },
  { election: "समुदाय मतदान 2024", date: "Aug 20, 2024", candidate: "Arvind Kumar Gupta", status: "completed" },
];

// Custom hook for election data with real-time simulation
export function useElectionData() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [elections, setElections] = useState<Election[]>(initialElections);
  const [voters, setVoters] = useState<Voter[]>(initialVoters);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>(initialVoteHistory);
  const [userVote, setUserVote] = useState<{ electionId: string; candidateId: string } | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Simulate real-time vote updates
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

// Global time formatter
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Format relative time
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
