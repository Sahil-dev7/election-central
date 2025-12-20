import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  Vote, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const demoAccounts = [
  { role: "super_admin" as UserRole, email: "super@electvote.com", label: "Super Admin", icon: Crown, description: "Full system control" },
  { role: "admin" as UserRole, email: "admin@electvote.com", label: "Admin", icon: Shield, description: "Manage elections" },
  { role: "voter" as UserRole, email: "voter@electvote.com", label: "Voter", icon: Users, description: "Cast votes" },
];

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";
  const [mode, setMode] = useState<"login" | "register">(isRegister ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleDemoLogin = async (role: UserRole, email: string) => {
    setSelectedRole(role);
    const success = await login(email, "demo123", role);
    
    if (success) {
      toast({
        title: "Welcome to ElectVote!",
        description: `Logged in as ${role.replace("_", " ").toUpperCase()}`,
      });
      
      // Redirect based on role
      if (role === "super_admin") {
        navigate("/super-admin");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
    setSelectedRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    let success = false;
    if (mode === "login") {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.fullName, formData.email, formData.password);
    }

    if (success) {
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description: mode === "login" 
          ? "You've been successfully logged in." 
          : "Your account has been created successfully.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ElectVote</span>
          </Link>

          {/* Demo Quick Access */}
          <div className="mb-8 p-4 rounded-xl bg-secondary/50 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-election-gold animate-pulse" />
              Quick Demo Access
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(account.role, account.email)}
                  disabled={isLoading}
                  className={cn(
                    "flex-col h-auto py-3 gap-1",
                    selectedRole === account.role && "border-election-gold bg-election-gold/10"
                  )}
                >
                  <account.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{account.label}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click to instantly log in with demo credentials
            </p>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "login" 
                ? "Enter your credentials to access your account" 
                : "Join thousands of voters making their voices heard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-11"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-election-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-muted-foreground text-sm">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-election-blue font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-election-blue" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-election-blue" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }} />
        </div>

        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 mx-auto">
              <Vote className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Vote Matters
            </h2>
            <p className="text-white/80 max-w-sm">
              Join millions of voters who trust ElectVote for secure, 
              transparent, and accessible elections.
            </p>

            {/* Feature list */}
            <div className="mt-10 space-y-4 text-left">
              {[
                "Secure blockchain-verified voting",
                "Real-time election results",
                "Multi-factor authentication",
                "24/7 voter support",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-election-gold flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
