import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Vote,
  BarChart3,
  TrendingUp,
  Calendar,
  AlertCircle,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ElectionCard } from "@/components/ElectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  {
    id: "3",
    title: "Q3 Board Elections",
    description: "Quarterly board member election",
    startDate: "Oct 1, 2024",
    endDate: "Oct 8, 2024",
    candidateCount: 4,
    voterCount: 8500,
    votesCast: 7200,
    status: "closed" as const,
  },
];

const mockCandidates = [
  { id: "1", name: "Sarah Mitchell", party: "Progressive Alliance", photo: candidate1, votes: 12450, status: "approved" },
  { id: "2", name: "Robert Chen", party: "Unity Coalition", photo: candidate2, votes: 9830, status: "approved" },
  { id: "3", name: "Marcus Rivera", party: "Future Forward", photo: candidate3, votes: 4120, status: "approved" },
  { id: "4", name: "Elizabeth Grant", party: "Citizens First", photo: candidate4, votes: 2050, status: "pending" },
];

const mockVoters = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "active", votedIn: 3 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "active", votedIn: 2 },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", status: "pending", votedIn: 0 },
  { id: "4", name: "Emily Brown", email: "emily@example.com", status: "suspended", votedIn: 1 },
];

const recentActivity = [
  { type: "vote", message: "New vote cast in Municipal Elections", time: "2 min ago" },
  { type: "user", message: "New voter registration: Sarah Williams", time: "15 min ago" },
  { type: "election", message: "Student Union Elections scheduled", time: "1 hour ago" },
  { type: "alert", message: "High voter turnout detected", time: "2 hours ago" },
];

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalVotes = mockCandidates.reduce((acc, c) => acc + c.votes, 0);

  return (
    <DashboardLayout userRole="admin" userName="Admin User">
      <div className="space-y-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage elections, candidates, and voters</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              New Election
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Elections"
            value={mockElections.length}
            subtitle="1 active, 1 draft"
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Total Voters"
            value="65,500"
            subtitle="Active registrations"
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Votes Cast Today"
            value="2,847"
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Elections overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Elections Overview</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockElections.slice(0, 2).map((election) => (
                <ElectionCard
                  key={election.id}
                  {...election}
                  isAdmin={true}
                  onView={(id) => console.log("View", id)}
                  onStatusChange={(id, status) => console.log("Status change", id, status)}
                />
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <Button variant="ghost" size="icon">
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
                    {activity.type === "vote" && <Vote className="w-4 h-4" />}
                    {activity.type === "user" && <Users className="w-4 h-4" />}
                    {activity.type === "election" && <Calendar className="w-4 h-4" />}
                    {activity.type === "alert" && <AlertCircle className="w-4 h-4" />}
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
              <Button variant="hero" size="sm">
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
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockCandidates.map((candidate, i) => (
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
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-foreground">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{candidate.party}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{candidate.votes.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((candidate.votes / totalVotes) * 100)}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                        candidate.status === "approved" && "bg-emerald-500/10 text-emerald-600",
                        candidate.status === "pending" && "bg-amber-500/10 text-amber-600"
                      )}>
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
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

        {/* Voters section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Voter Management</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export List
              </Button>
              <Button variant="hero" size="sm">
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
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockVoters.map((voter, i) => (
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
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                        voter.status === "active" && "bg-emerald-500/10 text-emerald-600",
                        voter.status === "pending" && "bg-amber-500/10 text-amber-600",
                        voter.status === "suspended" && "bg-rose-500/10 text-rose-600"
                      )}>
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
    </DashboardLayout>
  );
}
