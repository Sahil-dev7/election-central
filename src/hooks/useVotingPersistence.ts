import { useState, useEffect, useCallback } from "react";
import { setSecureStorage, getSecureStorage } from "@/utils/integrityCheck";

const VOTING_STORAGE_KEY = "electvote_user_votes_secure";

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
  isLoading: boolean;
  integrityValid: boolean;
}

export function useVotingPersistence(): VotingPersistence {
  const [votedElections, setVotedElections] = useState<Record<string, VotingRecord>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [integrityValid, setIntegrityValid] = useState(true);

  // Load from secure storage on mount
  useEffect(() => {
    async function loadVotes() {
      try {
        const stored = await getSecureStorage<Record<string, VotingRecord>>(VOTING_STORAGE_KEY);
        if (stored) {
          setVotedElections(stored);
          setIntegrityValid(true);
        } else {
          // Check if there was old unsecured data that was tampered
          const oldData = localStorage.getItem(VOTING_STORAGE_KEY);
          if (oldData) {
            console.warn('[Security] Vote data integrity check failed - possible tampering detected');
            setIntegrityValid(false);
          }
        }
      } catch (error) {
        console.error("Failed to load voting data:", error);
        setIntegrityValid(false);
      } finally {
        setIsLoading(false);
      }
    }
    loadVotes();
  }, []);

  // Sync to secure storage whenever votedElections changes
  useEffect(() => {
    if (!isLoading && Object.keys(votedElections).length > 0) {
      setSecureStorage(VOTING_STORAGE_KEY, votedElections).catch(error => {
        console.error("Failed to save voting data:", error);
      });
    }
  }, [votedElections, isLoading]);

  const hasVotedInElection = useCallback((electionId: string): boolean => {
    return !!votedElections[electionId];
  }, [votedElections]);

  const recordVote = useCallback((electionId: string, candidateId: string, candidateName: string): VotingRecord => {
    // Generate a cryptographically random transaction ID
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const transactionId = `VT-${Date.now()}-${Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().slice(0, 8)}`;
    
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
    isLoading,
    integrityValid,
  };
}
