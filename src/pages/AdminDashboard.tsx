import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Vote,
  BarChart3,
  TrendingUp,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pause,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  StopCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ElectionCard } from "@/components/ElectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useElectionData, getTimeGreeting } from "@/hooks/useElectionData";

const recentActivity = [
  { type: "vote", message: "New vote cast in Municipal Elections", time: "2 min ago", icon: Vote },
  { type: "user", message: "New voter registration: Priya Sharma", time: "15 min ago", icon: Users },
  { type: "election", message: "Lok Sabha Elections updated", time: "1 hour ago", icon: Calendar },
  { type: "alert", message: "High voter turnout detected", time: "2 hours ago", icon: TrendingUp },
  { type: "vote", message: "50 votes cast in last hour", time: "3 hours ago", icon: Vote },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    candidates,
    elections,
    voters,
    approveCandidate,
    rejectCandidate,
    approveVoter,
    suspendVoter,
    updateElectionStatus,
    addElection,
    addCandidate,
    getTotalVotes,
  } = useElectionData();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showEmergencyStop, setShowEmergencyStop] = useState(false);
  const [newElection, setNewElection] = useState({ title: "", titleHi: "", description: "", descriptionHi: "", startDate: "", endDate: "" });
  const [newCandidate, setNewCandidate] = useState({ name: "", nameHi: "", party: "", partyHi: "", manifesto: "", manifestoHi: "", constituency: "", constituencyHi: "" });

  const totalVotes = getTotalVotes();
  const activeElections = elections.filter(e => e.status === "active").length;
  const totalVoters = voters.length * 1000 + 500; // Simulated scale

  const handleCreateElection = () => {
    if (!newElection.title || !newElection.startDate || !newElection.endDate) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    addElection({
      title: newElection.title,
      titleHi: newElection.titleHi || newElection.title,
      description: newElection.description,
      descriptionHi: newElection.descriptionHi || newElection.description,
      startDate: newElection.startDate,
      endDate: newElection.endDate,
      candidateCount: 0,
      voterCount: 10000,
      status: "draft",
    });
    toast({ title: "Election Created", description: `"${newElection.title}" has been created as a draft.` });
    setShowCreateElection(false);
    setNewElection({ title: "", titleHi: "", description: "", descriptionHi: "", startDate: "", endDate: "" });
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.party) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    addCandidate({
      name: newCandidate.name,
      nameHi: newCandidate.nameHi || newCandidate.name,
      party: newCandidate.party,
      partyHi: newCandidate.partyHi || newCandidate.party,
      photo: "/placeholder.svg",
      manifesto: newCandidate.manifesto,
      manifestoHi: newCandidate.manifestoHi || newCandidate.manifesto,
      constituency: newCandidate.constituency || "General",
      constituencyHi: newCandidate.constituencyHi || "सामान्य",
    });
    toast({ title: "Candidate Added", description: `${newCandidate.name} has been added and is pending approval.` });
    setShowAddCandidate(false);
    setNewCandidate({ name: "", nameHi: "", party: "", partyHi: "", manifesto: "", manifestoHi: "", constituency: "", constituencyHi: "" });
  };

  const handleEmergencyStop = () => {
    const activeElection = elections.find(e => e.status === "active");
    if (activeElection) {
      updateElectionStatus(activeElection.id, "paused");
      toast({ title: "Election Paused", description: "All voting has been temporarily stopped.", variant: "destructive" });
    }
    setShowEmergencyStop(false);
  };

  const handleApproveCandidate = (id: string, name: string) => {
    approveCandidate(id);
    toast({ title: "Candidate Approved", description: `${name} is now approved to receive votes.` });
  };

  const handleRejectCandidate = (id: string, name: string) => {
    rejectCandidate(id);
    toast({ title: "Candidate Rejected", description: `${name} has been removed from the election.`, variant: "destructive" });
  };

  const handleApproveVoter = (id: string, name: string) => {
    approveVoter(id);
    toast({ title: "Voter Approved", description: `${name} can now participate in elections.` });
  };

  const handleSuspendVoter = (id: string, name: string) => {
    suspendVoter(id);
    toast({ title: "Voter Suspended", description: `${name} has been suspended.`, variant: "destructive" });
  };

  const handleExportData = () => {
    toast({ title: "Exporting Data", description: "Your data export will be ready shortly." });
  };

  const handleRefresh = () => {
    toast({ title: "Data Refreshed", description: "Showing latest statistics." });
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin" userName={user?.name || "Admin User"}>
      <div className="space-y-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{getTimeGreeting()}</p>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage elections, candidates, and voters</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExportData}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="hero" onClick={() => setShowCreateElection(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Election
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Elections"
            value={elections.length}
            subtitle={`${activeElections} active, ${elections.filter(e => e.status === "draft").length} draft`}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Total Voters"
            value={totalVoters.toLocaleString()}
            subtitle="Active registrations"
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Votes Cast Today"
            value={totalVotes.toLocaleString()}
            subtitle="Across all elections"
            icon={Vote}
            variant="gold"
          />
          <StatsCard
            title="Average Turnout"
            value="68%"
            subtitle="Last 30 days"
            icon={TrendingUp}
            variant="success"
        />
        </div>

        {/* Quick Actions Section */}
        <section className="glass-card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              disabled
              title="Import voters functionality coming soon"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Import Voters</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              disabled
              title="Report generation coming soon"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">Generate Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              disabled
              title="Notifications coming soon"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs">Send Alert</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              disabled
              title="Backup functionality coming soon"
            >
              <Lock className="w-5 h-5" />
              <span className="text-xs">Backup Data</span>
            </Button>
          </div>
        </section>

        {/* Live Voting Stats */}
        <section className="glass-card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Live Voting Stats</h2>
                <p className="text-sm text-muted-foreground">2024 Municipal Elections</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowEmergencyStop(true)}
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vote distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Vote Distribution</h3>
              {candidates.filter(c => c.status === "approved").slice(0, 4).map((candidate, i) => {
                const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={candidate.photo} alt={candidate.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-foreground">{candidate.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{percentage}%</span>
                        <span className="text-xs text-muted-foreground">({candidate.voteCount.toLocaleString()})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          i === 0 ? "bg-election-gold" : "bg-election-blue"
                        )}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Election Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-foreground">{totalVotes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-foreground">63.2%</p>
                  <p className="text-sm text-muted-foreground">Turnout Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-foreground">{(45000 - totalVotes).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-foreground">4d 12h</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Time Left</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-election-gold/10 border border-election-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-election-gold" />
                  <span className="text-sm font-medium text-foreground">Trending Up</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vote rate increased by 23% in the last hour
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Elections overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Elections Overview</h2>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Elections", description: "Viewing all elections." })}>View All</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {elections.slice(0, 2).map((election) => (
                <ElectionCard
                  key={election.id}
                  {...election}
                  isAdmin={true}
                  onView={() => toast({ title: election.title, description: `Status: ${election.status}` })}
                  onStatusChange={(id, status) => {
                    updateElectionStatus(id, status);
                    toast({ title: "Status Updated", description: `Election status changed to ${status}` });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="glass-card divide-y divide-border">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 flex items-start gap-3"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    activity.type === "vote" && "bg-election-blue/10 text-election-blue",
                    activity.type === "user" && "bg-emerald-500/10 text-emerald-500",
                    activity.type === "election" && "bg-election-gold/10 text-election-gold",
                    activity.type === "alert" && "bg-amber-500/10 text-amber-500"
                  )}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Candidates table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Candidates Management</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="hero" size="sm" onClick={() => setShowAddCandidate(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Candidate
              </Button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Candidate</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Party</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Votes</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Progress</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCandidates.map((candidate, i) => {
                  const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
                  return (
                    <motion.tr
                      key={candidate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-background"
                          />
                          <span className="font-medium text-foreground">{candidate.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{candidate.party}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{candidate.voteCount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </td>
                      <td className="p-4 w-40">
                        <Progress value={percentage} className="h-2" />
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          candidate.status === "approved" && "bg-success/10 text-success",
                          candidate.status === "pending" && "bg-amber-500/10 text-amber-600",
                          candidate.status === "rejected" && "bg-destructive/10 text-destructive"
                        )}>
                          {candidate.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                          {candidate.status === "pending" && <Clock className="w-3 h-3" />}
                          {candidate.status === "rejected" && <XCircle className="w-3 h-3" />}
                          {candidate.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast({ title: candidate.name, description: candidate.manifesto })}>
                              <Eye className="w-4 h-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Opening candidate editor..." })}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            {candidate.status === "pending" && (
                              <DropdownMenuItem className="text-success" onClick={() => handleApproveCandidate(candidate.id, candidate.name)}>
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleRejectCandidate(candidate.id, candidate.name)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Voters section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Voter Management</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-1" />
                Export List
              </Button>
              <Button variant="hero" size="sm" onClick={() => toast({ title: "Add Voter", description: "Voter registration form would open here." })}>
                <Plus className="w-4 h-4 mr-1" />
                Add Voter
              </Button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Voter</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Elections Voted</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Last Active</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {voters.map((voter, i) => (
                  <motion.tr
                    key={voter.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm font-semibold text-foreground">
                            {voter.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{voter.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{voter.email}</td>
                    <td className="p-4 font-medium text-foreground">{voter.votedIn}</td>
                    <td className="p-4 text-sm text-muted-foreground">{voter.lastActive}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        voter.status === "active" && "bg-success/10 text-success",
                        voter.status === "pending" && "bg-amber-500/10 text-amber-600",
                        voter.status === "suspended" && "bg-destructive/10 text-destructive"
                      )}>
                        {voter.status === "active" && <CheckCircle2 className="w-3 h-3" />}
                        {voter.status === "pending" && <Clock className="w-3 h-3" />}
                        {voter.status === "suspended" && <XCircle className="w-3 h-3" />}
                        {voter.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({ title: voter.name, description: `Email: ${voter.email}` })}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Opening voter editor..." })}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {voter.status === "pending" && (
                            <DropdownMenuItem className="text-success" onClick={() => handleApproveVoter(voter.id, voter.name)}>
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleSuspendVoter(voter.id, voter.name)}>
                            <Lock className="w-4 h-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Create Election Dialog */}
      <Dialog open={showCreateElection} onOpenChange={setShowCreateElection}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
            <DialogDescription>
              Set up a new election with candidates and voting periods.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Election Title *</Label>
              <Input 
                placeholder="e.g., 2024 Board Elections"
                value={newElection.title}
                onChange={(e) => setNewElection(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe the purpose of this election..." 
                rows={3}
                value={newElection.description}
                onChange={(e) => setNewElection(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input 
                  type="date"
                  value={newElection.startDate}
                  onChange={(e) => setNewElection(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input 
                  type="date"
                  value={newElection.endDate}
                  onChange={(e) => setNewElection(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateElection(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleCreateElection}>
              <Plus className="w-4 h-4 mr-2" />
              Create Election
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={showAddCandidate} onOpenChange={setShowAddCandidate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>
              Add a candidate to the current election.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input 
                placeholder="Enter candidate name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Party / Affiliation *</Label>
              <Input 
                placeholder="e.g., Progressive Alliance"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Manifesto</Label>
              <Textarea 
                placeholder="Candidate's key policies and vision..." 
                rows={4}
                value={newCandidate.manifesto}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, manifesto: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCandidate(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleAddCandidate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Stop Dialog */}
      <Dialog open={showEmergencyStop} onOpenChange={setShowEmergencyStop}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Emergency Stop Election
            </DialogTitle>
            <DialogDescription>
              This will immediately pause the election. All voting will be stopped until the election is resumed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                Warning: This action will immediately stop all voting activity for this election.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmergencyStop(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmergencyStop}>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Election
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
