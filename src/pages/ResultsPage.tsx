import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  BarChart3,
  Download,
  Filter,
  PieChart,
  FileText,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useElectionData } from "@/hooks/useElectionData";
import { PartySymbol } from "@/components/PartySymbols";
import { exportResultsCSV, exportResultsPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

export default function ResultsPage() {
  const { user } = useAuth();
  const { candidates, elections, getTotalVotes, getVoterTurnout } = useElectionData();
  const { toast } = useToast();
  
  const [selectedElection, setSelectedElection] = useState("1");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    party: "",
    minVotes: "",
    constituency: "",
  });
  const [activeFilters, setActiveFilters] = useState({
    party: "",
    minVotes: "",
    constituency: "",
  });

  const totalVotes = getTotalVotes();
  const voterTurnout = getVoterTurnout(selectedElection);
  const activeElection = elections.find(e => e.id === selectedElection);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates].filter(c => c.status === "approved");
    
    if (activeFilters.party) {
      filtered = filtered.filter(c => 
        c.party.toLowerCase().includes(activeFilters.party.toLowerCase())
      );
    }
    
    if (activeFilters.minVotes) {
      const minVotes = parseInt(activeFilters.minVotes, 10);
      if (!isNaN(minVotes)) {
        filtered = filtered.filter(c => c.voteCount >= minVotes);
      }
    }
    
    if (activeFilters.constituency) {
      filtered = filtered.filter(c => 
        c.constituency.toLowerCase().includes(activeFilters.constituency.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => b.voteCount - a.voteCount);
  }, [candidates, activeFilters]);

  const winner = filteredCandidates[0];
  const maxVotes = winner?.voteCount || 1;

  const getPartyShortName = (party: string): string => {
    if (party.includes("BJP")) return "BJP";
    if (party.includes("Congress")) return "INC";
    if (party.includes("AAP")) return "AAP";
    if (party.includes("Trinamool")) return "TMC";
    return party.substring(0, 3).toUpperCase();
  };

  const handleApplyFilters = () => {
    setActiveFilters({ ...filters });
    setShowFilterDialog(false);
    toast({
      title: "Filters Applied",
      description: "Results have been filtered based on your criteria.",
    });
  };

  const handleClearFilters = () => {
    setFilters({ party: "", minVotes: "", constituency: "" });
    setActiveFilters({ party: "", minVotes: "", constituency: "" });
    toast({
      title: "Filters Cleared",
      description: "Showing all candidates.",
    });
  };

  const handleExportCSV = () => {
    if (activeElection) {
      exportResultsCSV(
        candidates.filter(c => c.status === "approved"),
        activeElection
      );
      toast({
        title: "Export Successful",
        description: "Election results have been downloaded as CSV.",
      });
    }
  };

  const handleExportPDF = () => {
    if (activeElection) {
      exportResultsPDF(
        candidates.filter(c => c.status === "approved"),
        activeElection
      );
      toast({
        title: "Export Successful",
        description: "Election results have been downloaded as PDF.",
      });
    }
  };

  const hasActiveFilters = activeFilters.party || activeFilters.minVotes || activeFilters.constituency;

  return (
    <DashboardLayout userRole={user?.role || "admin"} userName={user?.name || "Admin"}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-6 h-6 text-election-gold" />
              चुनाव परिणाम
            </h1>
            <p className="text-muted-foreground mt-1">
              लाइव मतगणना और विस्तृत विश्लेषण देखें
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select value={selectedElection} onValueChange={setSelectedElection}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="चुनाव चुनें" />
              </SelectTrigger>
              <SelectContent>
                {elections.map(election => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant={hasActiveFilters ? "default" : "outline"}
              onClick={() => setShowFilterDialog(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              फ़िल्टर
              {hasActiveFilters && <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">Active</span>}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  निर्यात
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {activeFilters.party && (
              <Badge variant="secondary" className="gap-1">
                Party: {activeFilters.party}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, party: "" }))} />
              </Badge>
            )}
            {activeFilters.minVotes && (
              <Badge variant="secondary" className="gap-1">
                Min Votes: {activeFilters.minVotes}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, minVotes: "" }))} />
              </Badge>
            )}
            {activeFilters.constituency && (
              <Badge variant="secondary" className="gap-1">
                Constituency: {activeFilters.constituency}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(prev => ({ ...prev, constituency: "" }))} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-election-gold/10 to-election-gold/5 border-election-gold/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-election-gold/20">
                  <Trophy className="w-6 h-6 text-election-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">विजेता</p>
                  <p className="text-lg font-bold truncate">{winner?.name || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">कुल मत</p>
                  <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">मतदान प्रतिशत</p>
                  <p className="text-2xl font-bold">{voterTurnout}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">स्थिति</p>
                  <Badge className={
                    activeElection?.status === "active" ? "bg-green-500" :
                    activeElection?.status === "closed" ? "bg-gray-500" : "bg-amber-500"
                  }>
                    {activeElection?.status === "active" ? "जारी" :
                     activeElection?.status === "closed" ? "समाप्त" : "प्रारूप"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vote Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                मत वितरण
                {hasActiveFilters && <Badge variant="outline" className="ml-2">Filtered</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No candidates match the current filters.
                </div>
              ) : (
                filteredCandidates.map((candidate, index) => {
                  const percentage = Math.round((candidate.voteCount / totalVotes) * 100) || 0;
                  const isWinner = index === 0;
                  
                  return (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        isWinner ? "border-election-gold bg-election-gold/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-border"
                          />
                          {isWinner && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-election-gold rounded-full flex items-center justify-center">
                              <Trophy className="w-3 h-3 text-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{candidate.name}</h3>
                            {isWinner && (
                              <Badge className="bg-election-gold text-foreground">विजेता</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <PartySymbol party={candidate.party} className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">{candidate.party}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{candidate.voteCount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-3 ${isWinner ? "[&>div]:bg-election-gold" : ""}`}
                      />
                    </motion.div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Party-wise Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                दलवार सारांश
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredCandidates.map((candidate, index) => {
                const percentage = Math.round((candidate.voteCount / totalVotes) * 100) || 0;
                return (
                  <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <PartySymbol party={candidate.party} className="w-6 h-6" />
                    <div className="flex-1">
                      <p className="font-medium">{getPartyShortName(candidate.party)}</p>
                      <p className="text-xs text-muted-foreground">{candidate.voteCount.toLocaleString()} मत</p>
                    </div>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {percentage}%
                    </Badge>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">चुनाव विवरण</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">कुल मतदाता</span>
                    <span className="font-medium">{activeElection?.voterCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">मतदान किया</span>
                    <span className="font-medium">{activeElection?.votesCast.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">प्रारंभ तिथि</span>
                    <span className="font-medium">{activeElection?.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">समाप्ति तिथि</span>
                    <span className="font-medium">{activeElection?.endDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Results</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Party Name</label>
                <Input
                  placeholder="e.g., BJP, Congress, AAP"
                  value={filters.party}
                  onChange={(e) => setFilters(prev => ({ ...prev, party: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Votes</label>
                <Input
                  type="number"
                  placeholder="e.g., 10000"
                  value={filters.minVotes}
                  onChange={(e) => setFilters(prev => ({ ...prev, minVotes: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Constituency</label>
                <Input
                  placeholder="e.g., Varanasi, Delhi"
                  value={filters.constituency}
                  onChange={(e) => setFilters(prev => ({ ...prev, constituency: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
