import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Users, 
  Vote, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Play
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ElectionCard } from "@/components/ElectionCard";
import { CandidateCard } from "@/components/CandidateCard";
import { VoteConfirmationModal } from "@/components/VoteConfirmationModal";
import { VoteSuccessAnimation } from "@/components/VoteSuccessAnimation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import candidate1 from "@/assets/candidate-1.jpg";
import candidate2 from "@/assets/candidate-2.jpg";
import candidate3 from "@/assets/candidate-3.jpg";
import candidate4 from "@/assets/candidate-4.jpg";

// Mock data
const mockElections = [
  {
    id: "1",
    title: "2024 Municipal Elections",
    description: "Vote for your city council representatives and mayor",
    startDate: "Dec 15, 2024",
    endDate: "Dec 22, 2024",
    candidateCount: 8,
    voterCount: 45000,
    votesCast: 28450,
    status: "active" as const,
  },
  {
    id: "2",
    title: "Student Union Elections",
    description: "Annual election for student body president and senate",
    startDate: "Jan 5, 2025",
    endDate: "Jan 12, 2025",
    candidateCount: 6,
    voterCount: 12000,
    votesCast: 0,
    status: "draft" as const,
  },
];

const mockCandidates = [
  {
    id: "1",
    name: "Sarah Mitchell",
    party: "Progressive Alliance",
    photo: candidate1,
    manifesto: "Building a sustainable future with clean energy initiatives and community development programs.",
    voteCount: 12450,
  },
  {
    id: "2",
    name: "Robert Chen",
    party: "Unity Coalition",
    photo: candidate2,
    manifesto: "Strengthening our economy through small business support and infrastructure investment.",
    voteCount: 9830,
  },
  {
    id: "3",
    name: "Marcus Rivera",
    party: "Future Forward",
    photo: candidate3,
    manifesto: "Embracing innovation and technology to modernize public services and education.",
    voteCount: 4120,
  },
  {
    id: "4",
    name: "Elizabeth Grant",
    party: "Citizens First",
    photo: candidate4,
    manifesto: "Prioritizing healthcare access and affordable housing for all residents.",
    voteCount: 2050,
  },
];

export default function Dashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  const totalVotes = mockCandidates.reduce((acc, c) => acc + c.voteCount, 0);
  const selectedCandidateData = mockCandidates.find((c) => c.id === selectedCandidate);

  const handleVoteConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowConfirmation(false);
    setShowSuccess(true);
    setHasVoted(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    toast({
      title: "Vote recorded successfully",
      description: "Thank you for participating in democracy!",
    });
  };

  return (
    <DashboardLayout userRole="voter" userName="John Doe">
      <div className="space-y-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-6 gradient-hero relative overflow-hidden"
        >
          <div className="absolute inset-0 election-pattern opacity-50" />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, John!</h1>
            <p className="text-white/80 mb-4">
              You have 1 active election available. Your vote matters - make it count!
            </p>
            <div className="flex items-center gap-4">
              <Button variant="vote" size="lg">
                <Vote className="w-5 h-5" />
                Cast Your Vote
              </Button>
              <Button variant="glass">
                View Election Details
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Elections"
            value={1}
            subtitle="1 pending vote"
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Your Votes Cast"
            value={3}
            subtitle="This year"
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Total Candidates"
            value={mockCandidates.length}
            subtitle="In current election"
            icon={Users}
          />
          <StatsCard
            title="Current Turnout"
            value="63%"
            subtitle={`${totalVotes.toLocaleString()} votes`}
            icon={TrendingUp}
            trend={{ value: 5.2, isPositive: true }}
          />
        </div>

        {/* Active Election */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Active Elections</h2>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {mockElections.map((election) => (
              <ElectionCard
                key={election.id}
                {...election}
                onView={(id) => console.log("View election", id)}
              />
            ))}
          </div>
        </section>

        {/* Voting section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Cast Your Vote</h2>
              <p className="text-sm text-muted-foreground">2024 Municipal Elections - Select your candidate</p>
            </div>
            {hasVoted && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Vote Submitted</span>
              </div>
            )}
          </div>

          {!hasVoted ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {mockCandidates.map((candidate) => (
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

              {selectedCandidate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Thank You for Voting!</h3>
              <p className="text-muted-foreground mb-4">
                You voted for <span className="font-semibold text-foreground">{selectedCandidateData?.name}</span>
              </p>
              <Button variant="outline">
                View Live Results
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </section>

        {/* Live Results Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Live Results</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <Button variant="ghost" size="sm">
              Full Analytics <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="glass-card p-6">
            <div className="space-y-4">
              {mockCandidates
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate, index) => {
                  const percentage = Math.round((candidate.voteCount / totalVotes) * 100);
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
                        className="w-12 h-12 rounded-full object-cover"
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
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={cn(
                              "h-full rounded-full",
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
