import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Download,
  AlertCircle,
  Lock,
  Upload,
  FileText,
  Bell,
  Database,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface QuickActionProps {
  onDataChange?: () => void;
}

export function AdminQuickActions({ onDataChange }: QuickActionProps) {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const simulateProgress = async (callback: () => void) => {
    setIsProcessing(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(i);
    }
    callback();
    setIsProcessing(false);
    setProgress(0);
  };

  const handleImportVoters = async () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    await simulateProgress(() => {
      const voterCount = Math.floor(Math.random() * 500) + 100;
      toast({
        title: "Import Successful",
        description: `${voterCount} voters have been imported successfully.`,
      });
      setImportFile(null);
      setActiveDialog(null);
      onDataChange?.();
    });
  };

  const handleGenerateReport = async () => {
    await simulateProgress(() => {
      // Create a downloadable report
      const reportData = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalVoters: 45000,
          totalVotes: 28500,
          turnoutPercentage: "63.3%",
          activeElections: 3,
        },
        topCandidates: [
          { name: "Narendra Modi", votes: 12500, percentage: "43.9%" },
          { name: "Rahul Gandhi", votes: 8200, percentage: "28.8%" },
          { name: "Arvind Kejriwal", votes: 4800, percentage: "16.8%" },
        ],
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `election-report-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "Election report has been downloaded.",
      });
      setActiveDialog(null);
    });
  };

  const handleSendAlert = async () => {
    if (!alertTitle || !alertMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and message.",
        variant: "destructive",
      });
      return;
    }

    await simulateProgress(() => {
      toast({
        title: "Alert Sent",
        description: `Notification "${alertTitle}" sent to all registered voters.`,
      });
      setAlertTitle("");
      setAlertMessage("");
      setActiveDialog(null);
    });
  };

  const handleBackupData = async () => {
    await simulateProgress(() => {
      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        elections: [],
        candidates: [],
        voters: [],
        votes: [],
        metadata: {
          backupType: "full",
          encrypted: true,
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `electvote-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Complete",
        description: "System data has been securely backed up and downloaded.",
      });
      setActiveDialog(null);
    });
  };

  const actions = [
    {
      id: "import",
      icon: Users,
      label: "Import Voters",
      description: "Bulk import voters from CSV file",
    },
    {
      id: "report",
      icon: Download,
      label: "Generate Report",
      description: "Download comprehensive election report",
    },
    {
      id: "alert",
      icon: AlertCircle,
      label: "Send Alert",
      description: "Send notification to all voters",
    },
    {
      id: "backup",
      icon: Lock,
      label: "Backup Data",
      description: "Create secure data backup",
    },
  ];

  return (
    <>
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="h-20 w-full flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => setActiveDialog(action.id)}
              >
                <action.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Import Voters Dialog */}
      <Dialog open={activeDialog === "import"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Import Voters
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file with voter details. File should contain columns: Name, Email, Phone, Voter ID.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              <Input
                type="file"
                accept=".csv"
                className="hidden"
                id="voter-file"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="voter-file" className="cursor-pointer">
                <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                {importFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">{importFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.preventDefault();
                        setImportFile(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop<br />
                    <span className="text-xs">CSV files only</span>
                  </p>
                )}
              </label>
            </div>
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Importing...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleImportVoters} disabled={isProcessing || !importFile}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Voters
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={activeDialog === "report"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Generate Election Report
            </DialogTitle>
            <DialogDescription>
              Create a comprehensive report of all election data including votes, turnout, and candidate performance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-secondary/50 space-y-2">
              <p className="text-sm font-medium text-foreground">Report will include:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Election summary and statistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Candidate vote counts and percentages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Voter turnout analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Timeline of voting activity
                </li>
              </ul>
            </div>
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Generating report...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Alert Dialog */}
      <Dialog open={activeDialog === "alert"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Send Alert to Voters
            </DialogTitle>
            <DialogDescription>
              Send a notification to all registered voters about important election updates.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Alert Title *</Label>
              <Input
                placeholder="e.g., Voting Reminder"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Enter your message to voters..."
                rows={4}
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
              />
            </div>
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sending notifications...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSendAlert} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Send Alert
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Data Dialog */}
      <Dialog open={activeDialog === "backup"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Backup System Data
            </DialogTitle>
            <DialogDescription>
              Create a secure backup of all election data including voters, candidates, and vote records.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Backup</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All data will be encrypted and downloaded to your device. Store this backup in a secure location.
                  </p>
                </div>
              </div>
            </div>
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Creating backup...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleBackupData} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Backing up...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
