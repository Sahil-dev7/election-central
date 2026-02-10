import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Vote,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Calendar,
  Shield,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { GlobalThemeToggle } from "@/components/GlobalThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "admin" | "voter" | "super_admin";
  userName?: string;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", hash: "" },
  { icon: Calendar, label: "Elections", path: "/admin", hash: "#elections-section" },
  { icon: Users, label: "Candidates", path: "/admin", hash: "#candidates-section" },
  { icon: Users, label: "Voters", path: "/admin", hash: "#voters-section" },
  { icon: BarChart3, label: "Results", path: "/results", hash: "" },
  { icon: FileText, label: "Audit Logs", path: "/audit-logs", hash: "" },
  { icon: Settings, label: "Settings", path: "/settings", hash: "" },
];

const voterNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", hash: "" },
  { icon: Vote, label: "Vote Now", path: "/dashboard", hash: "#voting-section" },
  { icon: BarChart3, label: "Results", path: "/results", hash: "" },
  { icon: Calendar, label: "History", path: "/dashboard", hash: "#voting-history" },
  { icon: Settings, label: "Settings", path: "/settings", hash: "" },
];

export function DashboardLayout({ children, userRole = "voter", userName = "User" }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Show user's name if logged in, otherwise show "User"
  const displayName = user?.name || userName || "User";
  const displayEmail = user?.email || "";

  const navItems = userRole === "admin" || userRole === "super_admin" ? adminNavItems : voterNavItems;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <Vote className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-sidebar-foreground"
                >
                  ElectVote
                </motion.span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path && !item.hash;
              const handleNavClick = (e: React.MouseEvent) => {
                if (item.hash && location.pathname === item.path) {
                  e.preventDefault();
                  const el = document.querySelector(item.hash);
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              };
              return (
                <Link
                  key={`${item.path}-${idx}`}
                  to={`${item.path}${item.hash}`}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Role badge */}
          {!isCollapsed && (
            <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-sidebar-accent/50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sidebar-primary" />
                <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                  {userRole === "super_admin" ? "Super Admin" : userRole === "admin" ? "Administrator" : "Voter"}
                </span>
              </div>
            </div>
          )}

          {/* User & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{displayEmail}</p>
                </div>
              )}
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-[280px]"
        )}
      >
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Government emblem style */}
            <div className="w-8 h-8 rounded-full bg-election-gold/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-election-gold" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {navItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground">भारत निर्वाचन आयोग | Election Commission of India</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <GlobalThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-election-gold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <span className="text-sm font-medium">New vote recorded</span>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <span className="text-sm font-medium">Election status updated</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <span className="text-sm font-medium">System backup completed</span>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
