import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  BarChart3,
  Download,
  Filter,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useElectionData } from "@/hooks/useElectionData";
import { PartySymbol } from "@/components/PartySymbols";
import { useToast } from "@/hooks/use-toast";

export default function ResultsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { candidates, elections, getTotalVotes, getVoterTurnout } = useElectionData();
  const [selectedElection, setSelectedElection] = useState("1");
  const [filterParty, setFilterParty] = useState<string | null>(null);

  const totalVotes = getTotalVotes();
  const voterTurnout = getVoterTurnout(selectedElection);
  const activeElection = elections.find(e => e.id === selectedElection);

  let sortedCandidates = [...candidates]
    .filter(c => c.status === "approved")
    .sort((a, b) => b.voteCount - a.voteCount);

  // Apply party filter if selected
  if (filterParty) {
    sortedCandidates = sortedCandidates.filter(c => c.party === filterParty);
  }

  const winner = sortedCandidates[0];
  const uniqueParties = [...new Set(candidates.map(c => c.party))];

  const getPartyShortName = (party: string): string => {
    if (party.includes("BJP")) return "BJP";
    if (party.includes("Congress")) return "INC";
    if (party.includes("AAP")) return "AAP";
    return party.substring(0, 3).toUpperCase();
  };

  const handleExportResults = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ["रैंक / Rank", "उम्मीदवार / Candidate", "दल / Party", "मत / Votes", "प्रतिशत / Percentage"];
      const csvRows = sortedCandidates.map((candidate, index) => {
        const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
        return [
          index + 1,
          candidate.name,
          candidate.party,
          candidate.voteCount,
          `${percentage}%`
        ];
      });

      // Add summary section
      const summaryRows = [
        [],
        ["चुनाव विवरण / Election Details"],
        ["चुनाव / Election", activeElection?.title || "N/A"],
        ["कुल मत / Total Votes", totalVotes],
        ["मतदान प्रतिशत / Voter Turnout", `${voterTurnout}%`],
        ["कुल मतदाता / Total Voters", activeElection?.voterCount.toLocaleString() || "N/A"],
        ["अवधि / Duration", `${activeElection?.startDate} से ${activeElection?.endDate}`]
      ];

      // Combine all data
      const allRows = [csvHeaders, ...csvRows, ...summaryRows];
      const csvContent = allRows.map(row => row.join(",")).join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `election-results-${activeElection?.id || "export"}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "निर्यात सफल / Export Successful",
        description: `परिणाम CSV फाइल के रूप में डाउनलोड किए गए।`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "निर्यात विफल / Export Failed",
        description: "परिणाम निर्यात करने में त्रुटि।",
        variant: "destructive",
      });
    }
  };

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
              variant="outline" 
              onClick={handleExportResults}
              title="Export results as CSV"
            >
              <Download className="w-4 h-4 mr-2" />
              निर्यात
            </Button>
          </div>
        </motion.div>

        {/* Filter Section */}
        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">दल से फ़िल्टर / Filter by Party:</span>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterParty === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterParty(null)}
                >
                  सभी / All
                </Button>
                {uniqueParties.map(party => (
                  <Button
                    key={party}
                    variant={filterParty === party ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterParty(party)}
                  >
                    {getPartyShortName(party)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
                मत वितरण {filterParty && `(${getPartyShortName(filterParty)})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sortedCandidates.length > 0 ? (
                sortedCandidates.map((candidate, index) => {
                  const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  कोई उम्मीदवार नहीं मिले / No candidates found
                </div>
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
              {sortedCandidates.slice(0, 5).map((candidate, index) => {
                const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
                return (
                  <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <PartySymbol party={candidate.party} className="w-6 h-6" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{getPartyShortName(candidate.party)}</p>
                      <p className="text-xs text-muted-foreground">{candidate.voteCount.toLocaleString()} मत</p>
                    </div>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {percentage}%
                    </Badge>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">चुनाव विवरण</h4>
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
      </div>
    </DashboardLayout>
  );
}
