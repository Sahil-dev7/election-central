import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Vote,
  BarChart3,
  Shield,
  Lock,
  Unlock,
  Activity,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Power,
  TrendingUp,
  UserPlus,
  UserMinus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSystemState } from "@/hooks/useSystemState";
import { getTimeGreeting } from "@/hooks/useElectionData";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSystemLocked,
    lockSystem,
    unlockSystem,
    admins,
    addAdmin,
    suspendAdmin,
    activateAdmin,
    deleteAdmin,
    auditLogs,
    systemMetrics,
  } = useSystemState();

  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });

  const handleSystemLockToggle = () => {
    if (!isSystemLocked) {
      setShowLockDialog(true);
    } else {
      unlockSystem();
      toast({ title: "System Unlocked", description: "Voting system is now operational." });
    }
  };

  const confirmSystemLock = () => {
    lockSystem();
    setShowLockDialog(false);
    toast({ title: "System Locked", description: "Voting system has been locked.", variant: "destructive" });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    addAdmin(newAdmin.name, newAdmin.email);
    toast({ title: "Admin Created", description: `${newAdmin.name} has been added as an admin.` });
    setShowAddAdminDialog(false);
    setNewAdmin({ name: "", email: "" });
  };

  const handleSuspendAdmin = (id: string, name: string) => {
    suspendAdmin(id);
    toast({ title: "Admin Suspended", description: `${name} has been suspended.`, variant: "destructive" });
  };

  const handleActivateAdmin = (id: string, name: string) => {
    activateAdmin(id);
    toast({ title: "Admin Activated", description: `${name} is now active.` });
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    deleteAdmin(id);
    toast({ title: "Admin Deleted", description: `${name} has been removed.`, variant: "destructive" });
  };

  const handleExportLogs = () => {
    toast({ title: "Exporting Logs", description: "Audit logs will be downloaded shortly." });
  };

  const handleRefresh = () => {
    toast({ title: "Data Refreshed", description: "Showing latest system metrics." });
  };

  const handleEmergencyStop = () => {
    lockSystem();
    toast({ title: "Emergency Stop Activated", description: "All systems have been halted.", variant: "destructive" });
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userRole="super_admin" userName={user?.name || "Super Admin"}>
      <div className="space-y-8">
        {/* System Control Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "glass-card-elevated p-6 relative overflow-hidden",
            isSystemLocked ? "border-destructive/50" : "border-success/50"
          )}
        >
          <div className="absolute inset-0 election-pattern opacity-50" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                isSystemLocked ? "bg-destructive/10" : "bg-success/10"
              )}>
                {isSystemLocked ? (
                  <Lock className="w-8 h-8 text-destructive" />
                ) : (
                  <Unlock className="w-8 h-8 text-success" />
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{getTimeGreeting()}</p>
                <h1 className="text-2xl font-bold text-foreground">
                  Super Admin Control Center
                </h1>
                <p className="text-muted-foreground">
                  System Status: {" "}
                  <span className={cn(
                    "font-semibold",
                    isSystemLocked ? "text-destructive" : "text-success"
                  )}>
                    {isSystemLocked ? "LOCKED 🔒" : "OPERATIONAL ✓"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary">
                <span className="text-sm font-medium text-muted-foreground">System Lock</span>
                <Switch
                  checked={isSystemLocked}
                  onCheckedChange={handleSystemLockToggle}
                  className={isSystemLocked ? "data-[state=checked]:bg-destructive" : ""}
                />
              </div>
              <Button variant="outline" className="gap-2" onClick={handleEmergencyStop}>
                <Power className="w-4 h-4" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Admins"
            value={admins.length}
            subtitle={`${admins.filter(a => a.status === "suspended").length} suspended`}
            icon={Shield}
            variant="primary"
          />
          <StatsCard
            title="Active Elections"
            value={3}
            subtitle="2 active, 1 draft"
            icon={Vote}
            variant="gold"
          />
          <StatsCard
            title="Total Votes Today"
            value="12,847"
            subtitle="Across all elections"
            icon={BarChart3}
            trend={{ value: 23.5, isPositive: true }}
          />
          <StatsCard
            title="System Health"
            value="99.97%"
            subtitle="All systems operational"
            icon={Activity}
            variant="success"
          />
        </div>

        {/* Quick Actions for Super Admin */}
        <section className="glass-card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Super Admin Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast({ title: "Database Backup", description: "Creating full database backup..." })}
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">Backup DB</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast({ title: "Security Scan", description: "Running security audit..." })}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs">Security Scan</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast({ title: "Clear Cache", description: "System cache cleared successfully!" })}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs">Clear Cache</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast({ title: "System Logs", description: "Opening detailed system logs..." })}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">View Logs</span>
            </Button>
            <Button 
              variant="destructive" 
              className="h-20 flex-col gap-2"
              onClick={handleEmergencyStop}
            >
              <Power className="w-5 h-5" />
              <span className="text-xs">Emergency Stop</span>
            </Button>
          </div>
        </section>

        {/* System Metrics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">System Metrics</h2>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {systemMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    metric.status === "healthy" ? "bg-success animate-pulse" : "bg-destructive"
                  )} />
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Admin Management */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Admin Accounts</h2>
              <Button variant="hero" size="sm" onClick={() => setShowAddAdminDialog(true)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Add Admin
              </Button>
            </div>

            <div className="glass-card divide-y divide-border">
              {admins.map((admin, i) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold text-foreground">
                        {admin.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      admin.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {admin.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{admin.lastLogin}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: admin.name, description: `Email: ${admin.email}\nLast login: ${admin.lastLogin}` })}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Opening admin editor..." })}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => admin.status === "active" ? handleSuspendAdmin(admin.id, admin.name) : handleActivateAdmin(admin.id, admin.name)}>
                          {admin.status === "active" ? (
                            <>
                              <UserMinus className="w-4 h-4 mr-2" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAdmin(admin.id, admin.name)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Activity Analytics */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">System Analytics</h2>
              <Button variant="ghost" size="sm" onClick={handleExportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="glass-card p-6">
              <div className="space-y-6">
                {/* Activity chart placeholder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Votes Today</span>
                    <span className="font-semibold text-foreground">12,847</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-election-blue rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New Registrations</span>
                    <span className="font-semibold text-foreground">847</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-election-gold rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Sessions</span>
                    <span className="font-semibold text-foreground">1,247</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "62%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-success rounded-full"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">24.5K</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Elections</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">99.9%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Audit Logs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Audit Logs</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                Last 7 days
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Timestamp</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Action</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">User</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Details</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-foreground">{log.action}</span>
                    </td>
                    <td className="p-4 text-sm text-foreground">{log.user}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{log.details}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        log.severity === "info" && "bg-election-blue/10 text-election-blue",
                        log.severity === "warning" && "bg-amber-500/10 text-amber-600",
                        log.severity === "error" && "bg-destructive/10 text-destructive",
                        log.severity === "success" && "bg-success/10 text-success"
                      )}>
                        {log.severity}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Lock System Dialog */}
      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Lock className="w-5 h-5" />
              Lock Voting System
            </DialogTitle>
            <DialogDescription>
              This will lock the entire voting system. No one will be able to cast votes until you unlock it.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                Warning: This action will immediately stop all voting activity across all elections.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLockDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSystemLock}>
              <Lock className="w-4 h-4 mr-2" />
              Lock System
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input 
                placeholder="Enter admin name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input 
                type="email"
                placeholder="admin@electvote.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAdminDialog(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleAddAdmin}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
