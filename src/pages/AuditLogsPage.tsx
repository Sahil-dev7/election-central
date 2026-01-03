import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSystemState } from "@/hooks/useSystemState";

const severityConfig = {
  info: { icon: Info, color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  success: { icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/30" },
  warning: { icon: AlertTriangle, color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  error: { icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/30" },
};

export default function AuditLogsPage() {
  const { user } = useAuth();
  const { auditLogs } = useSystemState();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "Action", "User", "Details", "Severity"].join(","),
      ...filteredLogs.map(log => 
        [log.timestamp, log.action, log.user, `"${log.details}"`, log.severity].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
              <FileText className="w-6 h-6" />
              ऑडिट लॉग्स
            </h1>
            <p className="text-muted-foreground mt-1">
              सिस्टम गतिविधियों और परिवर्तनों का ट्रैक रखें
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            निर्यात करें
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(severityConfig).map(([severity, config]) => {
            const count = auditLogs.filter(log => log.severity === severity).length;
            const Icon = config.icon;
            return (
              <Card key={severity} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {severity === "info" ? "सूचना" : 
                         severity === "success" ? "सफल" :
                         severity === "warning" ? "चेतावनी" : "त्रुटि"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              फ़िल्टर
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="खोजें..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="गंभीरता" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी</SelectItem>
                  <SelectItem value="info">सूचना</SelectItem>
                  <SelectItem value="success">सफल</SelectItem>
                  <SelectItem value="warning">चेतावनी</SelectItem>
                  <SelectItem value="error">त्रुटि</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="समय अवधि" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी समय</SelectItem>
                  <SelectItem value="today">आज</SelectItem>
                  <SelectItem value="week">इस सप्ताह</SelectItem>
                  <SelectItem value="month">इस महीने</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">समय</TableHead>
                  <TableHead>कार्रवाई</TableHead>
                  <TableHead>उपयोगकर्ता</TableHead>
                  <TableHead className="hidden md:table-cell">विवरण</TableHead>
                  <TableHead className="w-24">स्थिति</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const config = severityConfig[log.severity];
                  const Icon = config.icon;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {log.timestamp}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          <Icon className="w-3 h-3 mr-1" />
                          {log.severity === "info" ? "सूचना" : 
                           log.severity === "success" ? "सफल" :
                           log.severity === "warning" ? "चेतावनी" : "त्रुटि"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">कोई लॉग नहीं मिले</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
