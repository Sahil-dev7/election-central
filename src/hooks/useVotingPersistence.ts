import { useState, useEffect, useCallback } from "react";

const VOTING_STORAGE_KEY = "electvote_user_votes";

interface VotingRecord {
  electionId: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
  transactionId: string;
}

interface VotingPersistence {
  votedElections: Record<string, VotingRecord>;
  hasVotedInElection: (electionId: string) => boolean;
  recordVote: (electionId: string, candidateId: string, candidateName: string) => VotingRecord;
  getVoteRecord: (electionId: string) => VotingRecord | null;
  getAllVotes: () => VotingRecord[];
}

export function useVotingPersistence(): VotingPersistence {
  const [votedElections, setVotedElections] = useState<Record<string, VotingRecord>>(() => {
    try {
      const stored = localStorage.getItem(VOTING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sync to localStorage whenever votedElections changes
  useEffect(() => {
    try {
      localStorage.setItem(VOTING_STORAGE_KEY, JSON.stringify(votedElections));
    } catch (error) {
      console.error("Failed to save voting data:", error);
    }
  }, [votedElections]);

  const hasVotedInElection = useCallback((electionId: string): boolean => {
    return !!votedElections[electionId];
  }, [votedElections]);

  const recordVote = useCallback((electionId: string, candidateId: string, candidateName: string): VotingRecord => {
    const transactionId = `VT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const record: VotingRecord = {
      electionId,
      candidateId,
      candidateName,
      timestamp: new Date().toISOString(),
      transactionId,
    };
    
    setVotedElections(prev => ({
      ...prev,
      [electionId]: record,
    }));
    
    return record;
  }, []);

  const getVoteRecord = useCallback((electionId: string): VotingRecord | null => {
    return votedElections[electionId] || null;
  }, [votedElections]);

  const getAllVotes = useCallback((): VotingRecord[] => {
    return Object.values(votedElections);
  }, [votedElections]);

  return {
    votedElections,
    hasVotedInElection,
    recordVote,
    getVoteRecord,
    getAllVotes,
  };
}
