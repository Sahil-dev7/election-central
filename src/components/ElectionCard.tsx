import { motion } from "framer-motion";
import { Calendar, Users, Clock, ChevronRight, Play, Pause, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ElectionStatus = "draft" | "active" | "paused" | "closed";

interface ElectionCardProps {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  candidateCount: number;
  voterCount: number;
  votesCast: number;
  status: ElectionStatus;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: ElectionStatus) => void;
  isAdmin?: boolean;
}

export function ElectionCard({
  id,
  title,
  description,
  startDate,
  endDate,
  candidateCount,
  voterCount,
  votesCast,
  status,
  onView,
  onStatusChange,
  isAdmin = false,
}: ElectionCardProps) {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      icon: Clock,
    },
    active: {
      label: "Active",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: Play,
    },
    paused: {
      label: "Paused",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: Pause,
    },
    closed: {
      label: "Closed",
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      icon: Lock,
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;
  const turnoutPercentage = voterCount > 0 ? Math.round((votesCast / voterCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass-card-elevated overflow-hidden"
    >
      {/* Status bar */}
      <div className={cn(
        "h-1",
        status === "active" && "bg-gradient-to-r from-emerald-500 to-emerald-400",
        status === "draft" && "bg-slate-400",
        status === "paused" && "bg-amber-500",
        status === "closed" && "bg-rose-500"
      )} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                currentStatus.color
              )}>
                <StatusIcon className="w-3 h-3" />
                {currentStatus.label}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{candidateCount}</p>
            <p className="text-xs text-muted-foreground">Candidates</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-foreground">{voterCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Voters</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-election-blue">{turnoutPercentage}%</p>
            <p className="text-xs text-muted-foreground">Turnout</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{startDate}</span>
          </div>
          <span>→</span>
          <span>{endDate}</span>
        </div>

        {/* Turnout progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Voter Turnout</span>
            <span className="font-medium text-foreground">{votesCast.toLocaleString()} votes</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${turnoutPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-election-blue to-election-gold rounded-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onView?.(id)}
          >
            {isAdmin ? "Manage" : "View Details"}
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {isAdmin && status !== "closed" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newStatus = status === "active" ? "paused" : "active";
                onStatusChange?.(id, newStatus);
              }}
            >
              {status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
