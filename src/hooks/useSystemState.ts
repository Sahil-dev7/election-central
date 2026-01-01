import { useState, useCallback, useEffect } from "react";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin";
  status: "active" | "suspended";
  createdAt: string;
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "success";
}

export interface SystemMetric {
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical";
}

const initialAdmins: Admin[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@electvote.com", role: "admin", status: "active", createdAt: "2024-01-15", lastLogin: "2 hours ago" },
  { id: "2", name: "Michael Chen", email: "michael@electvote.com", role: "admin", status: "active", createdAt: "2024-02-20", lastLogin: "1 day ago" },
  { id: "3", name: "Emily Rodriguez", email: "emily@electvote.com", role: "admin", status: "suspended", createdAt: "2024-03-10", lastLogin: "1 week ago" },
];

const initialAuditLogs: AuditLog[] = [
  { id: "1", action: "SYSTEM_LOCK", user: "Super Admin", details: "Voting system locked for maintenance", timestamp: "2024-12-20 10:30:00", severity: "warning" },
  { id: "2", action: "ADMIN_CREATED", user: "Super Admin", details: "New admin account: michael@electvote.com", timestamp: "2024-12-19 14:22:00", severity: "info" },
  { id: "3", action: "ELECTION_MODIFIED", user: "Sarah Johnson", details: "Municipal Elections end date extended", timestamp: "2024-12-19 09:15:00", severity: "info" },
  { id: "4", action: "VOTER_SUSPENDED", user: "Michael Chen", details: "Voter account suspended: suspicious activity", timestamp: "2024-12-18 16:45:00", severity: "error" },
  { id: "5", action: "RESULTS_EXPORTED", user: "Emily Rodriguez", details: "Q3 Board Elections results exported", timestamp: "2024-12-18 11:00:00", severity: "info" },
  { id: "6", action: "SYSTEM_UNLOCK", user: "Super Admin", details: "Voting system unlocked", timestamp: "2024-12-17 08:00:00", severity: "success" },
];

export function useSystemState() {
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { label: "Server Uptime", value: "99.97%", status: "healthy" },
    { label: "Active Sessions", value: "1,247", status: "healthy" },
    { label: "API Response", value: "45ms", status: "healthy" },
    { label: "Database Load", value: "23%", status: "healthy" },
  ]);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => prev.map(metric => {
        if (metric.label === "Active Sessions") {
          const base = 1247;
          const variance = Math.floor(Math.random() * 50) - 25;
          return { ...metric, value: (base + variance).toLocaleString() };
        }
        if (metric.label === "API Response") {
          const base = 45;
          const variance = Math.floor(Math.random() * 20) - 10;
          return { ...metric, value: `${Math.max(20, base + variance)}ms` };
        }
        return metric;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const lockSystem = useCallback(() => {
    setIsSystemLocked(true);
    addAuditLog("SYSTEM_LOCK", "Super Admin", "Voting system locked", "warning");
  }, []);

  const unlockSystem = useCallback(() => {
    setIsSystemLocked(false);
    addAuditLog("SYSTEM_UNLOCK", "Super Admin", "Voting system unlocked", "success");
  }, []);

  const addAuditLog = useCallback((action: string, user: string, details: string, severity: AuditLog["severity"]) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user,
      details,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  const addAdmin = useCallback((name: string, email: string) => {
    const newAdmin: Admin = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };
    setAdmins(prev => [...prev, newAdmin]);
    addAuditLog("ADMIN_CREATED", "Super Admin", `New admin account: ${email}`, "info");
    return newAdmin;
  }, [addAuditLog]);

  const suspendAdmin = useCallback((adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    setAdmins(prev =>
      prev.map(a => a.id === adminId ? { ...a, status: "suspended" } : a)
    );
    if (admin) {
      addAuditLog("ADMIN_SUSPENDED", "Super Admin", `Admin suspended: ${admin.email}`, "warning");
    }
  }, [admins, addAuditLog]);

  const activateAdmin = useCallback((adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    setAdmins(prev =>
      prev.map(a => a.id === adminId ? { ...a, status: "active" } : a)
    );
    if (admin) {
      addAuditLog("ADMIN_ACTIVATED", "Super Admin", `Admin activated: ${admin.email}`, "success");
    }
  }, [admins, addAuditLog]);

  const deleteAdmin = useCallback((adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    setAdmins(prev => prev.filter(a => a.id !== adminId));
    if (admin) {
      addAuditLog("ADMIN_DELETED", "Super Admin", `Admin deleted: ${admin.email}`, "error");
    }
  }, [admins, addAuditLog]);

  return {
    isSystemLocked,
    lockSystem,
    unlockSystem,
    admins,
    addAdmin,
    suspendAdmin,
    activateAdmin,
    deleteAdmin,
    auditLogs,
    addAuditLog,
    systemMetrics,
  };
}
