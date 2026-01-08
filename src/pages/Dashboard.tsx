import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Vote, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  History,
  Info,
  RefreshCw,
  Download,
  FileText
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ElectionCard } from "@/components/ElectionCard";
import { CandidateCard } from "@/components/CandidateCard";
import { VoteConfirmationModal } from "@/components/VoteConfirmationModal";
import { VoteSuccessAnimation } from "@/components/VoteSuccessAnimation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useElectionData, getTimeGreeting } from "@/hooks/useElectionData";
import { generateVoteReceipt } from "@/utils/generateVoteReceipt";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    candidates,
    elections,
    voteHistory,
    userVote,
    castVote,
    getTotalVotes,
    getVoterTurnout,
    isLiveUpdating,
    setIsLiveUpdating,
  } = useElectionData();

  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingStep, setVotingStep] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const totalVotes = getTotalVotes();
  const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate);
  const activeElection = elections.find(e => e.status === "active");
  const voterTurnout = activeElection ? getVoterTurnout(activeElection.id) : 0;

  // Track real-time updates
  useEffect(() => {
    if (isLiveUpdating) {
      const interval = setInterval(() => setLastUpdate(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [isLiveUpdating]);

  const handleVoteConfirm = async () => {
    if (!selectedCandidate || !activeElection) return;
    
    // CRITICAL: Prevent double voting
    if (userVote && userVote.electionId === activeElection.id) {
      toast({
        title: "Already Voted",
        description: "आप इस चुनाव में पहले ही मतदान कर चुके हैं। You have already voted in this election!",
        variant: "destructive",
      });
      setShowConfirmation(false);
      return;
    }
    
    setIsSubmitting(true);
    
    // Step animation
    setVotingStep(2);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVotingStep(3);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Cast the vote and check if successful
    const voteSuccess = castVote(activeElection.id, selectedCandidate);
    
    setIsSubmitting(false);
    
    if (voteSuccess) {
      setShowConfirmation(false);
      setShowSuccess(true);
      setHasVoted(true);
    } else {
      toast({
        title: "Vote Failed",
        description: "आप इस चुनाव में पहले ही मतदान कर चुके हैं। You have already voted in this election!",
        variant: "destructive",
      });
      setShowConfirmation(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    toast({
      title: "Vote recorded successfully! ✓",
      description: `Thank you for voting for ${selectedCandidateData?.name}. Your voice matters! आपके वोट के लिए धन्यवाद।`,
    });
  };

  const handleDownloadReceipt = () => {
    if (!selectedCandidateData || !activeElection) return;
    
    generateVoteReceipt({
      voterName: displayName,
      voterId: `VID${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      electionTitle: activeElection.title,
      candidateName: selectedCandidateData.name,
      candidateParty: selectedCandidateData.party,
      timestamp: new Date(),
      transactionId: `VT-2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    });
    
    toast({
      title: "रसीद डाउनलोड हो गई",
      description: "आपकी मतदान रसीद PDF के रूप में डाउनलोड हो गई है।",
    });
  };

  const handleViewResults = () => {
    toast({
      title: "Live Results",
      description: "Scroll down to see real-time voting results.",
    });
    document.getElementById("live-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleElectionInfo = () => {
    toast({
      title: "2024 Municipal Elections",
      description: "Voting ends Dec 22, 2024. Select your preferred candidate and confirm your vote.",
    });
  };

  const handleRefreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data refreshed",
      description: "Showing latest voting statistics.",
    });
  };

  // Show user's name if logged in, otherwise "User"
  const displayName = user?.name || "User";

  return (
    <DashboardLayout userRole="voter" userName={displayName}>
      <div className="space-y-8">
        {/* Welcome section with greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-6 gradient-hero relative overflow-hidden"
        >
          <div className="absolute inset-0 election-pattern opacity-50" />
          <div className="relative">
            <p className="text-white/60 text-sm mb-1">{getTimeGreeting()}, {displayName}</p>
            <h1 className="text-2xl font-bold text-white mb-2">
              स्वागत है! ElectVote में आपका स्वागत है 🗳️
            </h1>
            <p className="text-white/80 mb-4">
              {hasVoted || userVote
                ? "मतदान के लिए धन्यवाद! नीचे लाइव परिणाम देखें। Thank you for voting!"
                : `आपके पास ${elections.filter(e => e.status === "active").length} सक्रिय चुनाव उपलब्ध है। आपका वोट मायने रखता है!`}
            </p>
            <div className="flex items-center gap-4">
              {!hasVoted && !userVote && (
                <Button 
                  variant="vote" 
                  size="lg" 
                  onClick={() => document.getElementById("voting-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Vote className="w-5 h-5" />
                  अपना वोट डालें
                </Button>
              )}
              <Button variant="glass" onClick={handleElectionInfo}>
                <Info className="w-4 h-4 mr-2" />
                चुनाव जानकारी
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Elections"
            value={elections.filter(e => e.status === "active").length}
            subtitle={`${elections.filter(e => e.status === "draft").length} upcoming`}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Your Votes Cast"
            value={voteHistory.length + (hasVoted ? 1 : 0)}
            subtitle="This year"
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Total Candidates"
            value={candidates.filter(c => c.status === "approved").length}
            subtitle="In current election"
            icon={Users}
          />
          <StatsCard
            title="Current Turnout"
            value={`${voterTurnout}%`}
            subtitle={`${totalVotes.toLocaleString()} votes`}
            icon={TrendingUp}
            trend={{ value: 5.2, isPositive: true }}
          />
        </div>

        {/* Active Election */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Active Elections</h2>
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "All Elections", description: "Showing all available elections." })}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {elections.slice(0, 2).map((election) => (
              <ElectionCard
                key={election.id}
                {...election}
                onView={() => toast({ title: election.title, description: election.description })}
              />
            ))}
          </div>
        </section>

        {/* Voting section */}
        <section id="voting-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Cast Your Vote</h2>
              <p className="text-sm text-muted-foreground">2024 Municipal Elections - Select your candidate</p>
            </div>
            {(hasVoted || userVote) && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Vote Submitted</span>
              </div>
            )}
          </div>

          {!hasVoted && !userVote ? (
            <>
              {/* Voting steps indicator */}
              <div className="glass-card p-4 mb-6">
                <div className="flex items-center justify-between">
                  {["Select Candidate", "Review Choice", "Confirm Vote"].map((step, i) => (
                    <div key={i} className="flex items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                        votingStep > i + 1 ? "bg-success text-white" :
                        votingStep === i + 1 ? "bg-election-gold text-foreground" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {votingStep > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={cn(
                        "ml-2 text-sm font-medium hidden sm:block",
                        votingStep === i + 1 ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step}
                      </span>
                      {i < 2 && (
                        <div className={cn(
                          "w-12 lg:w-24 h-0.5 mx-4",
                          votingStep > i + 1 ? "bg-success" : "bg-secondary"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {candidates.filter(c => c.status === "approved").map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    {...candidate}
                    totalVotes={totalVotes}
                    isSelected={selectedCandidate === candidate.id}
                    onSelect={setSelectedCandidate}
                    showVoteButton={true}
                  />
                ))}
              </div>

              <AnimatePresence>
                {selectedCandidate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-center"
                  >
                    <Button
                      variant="vote"
                      size="xl"
                      onClick={() => setShowConfirmation(true)}
                      className="min-w-[300px]"
                    >
                      <Vote className="w-6 h-6" />
                      Confirm Vote for {selectedCandidateData?.name}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">मतदान के लिए धन्यवाद!</h3>
              <p className="text-muted-foreground mb-4">
                आपने <span className="font-semibold text-foreground">{selectedCandidateData?.name || userVote?.candidateId}</span> को वोट दिया
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="default" onClick={handleDownloadReceipt}>
                  <Download className="w-4 h-4 mr-2" />
                  रसीद डाउनलोड करें
                </Button>
                <Button variant="outline" onClick={handleViewResults}>
                  लाइव परिणाम देखें
                  <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Live Results Preview */}
        <section id="live-results">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Live Results</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>

          <div className="glass-card p-6">
            <div className="space-y-4">
              {[...candidates]
                .filter(c => c.status === "approved")
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate, index) => {
                  const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
                  return (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <span className="w-6 text-lg font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-background"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-semibold text-foreground">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({candidate.party})</span>
                          </div>
                          <span className="font-bold text-foreground">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              index === 0 ? "bg-election-gold" : "bg-election-blue"
                            )}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground min-w-[80px] text-right">
                        {candidate.voteCount.toLocaleString()} votes
                      </span>
                    </motion.div>
                  );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Last updated: Just now</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Total votes:</span>
                <span className="font-bold text-foreground">{totalVotes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Voting History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground">Your Voting History</h2>
            </div>
          </div>

          <div className="glass-card divide-y divide-border">
            {voteHistory.map((vote, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vote.election}</p>
                    <p className="text-sm text-muted-foreground">Voted for {vote.candidate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{vote.date}</p>
                  <span className="text-xs text-success">Verified ✓</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      {selectedCandidateData && (
        <>
          <VoteConfirmationModal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleVoteConfirm}
            candidateName={selectedCandidateData.name}
            candidateParty={selectedCandidateData.party}
            candidatePhoto={selectedCandidateData.photo}
            isSubmitting={isSubmitting}
          />
          <VoteSuccessAnimation
            isVisible={showSuccess}
            candidateName={selectedCandidateData.name}
            onClose={handleSuccessClose}
          />
        </>
      )}
    </DashboardLayout>
  );
}
