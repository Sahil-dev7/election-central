import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Vote, 
  Shield, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Globe,
  Fingerprint,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-voting.jpg";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "End-to-end encryption and blockchain-verified vote records ensure complete integrity.",
  },
  {
    icon: Fingerprint,
    title: "Verified Identity",
    description: "Multi-factor authentication ensures only eligible voters can participate.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Results",
    description: "Watch live vote counts and analytics as the election unfolds.",
  },
  {
    icon: Globe,
    title: "Vote Anywhere",
    description: "Cast your ballot securely from any device, anywhere in the world.",
  },
];

const stats = [
  { value: "2M+", label: "Votes Cast" },
  { value: "500+", label: "Elections" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Organizations" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ElectVote</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="hero" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-election-navy/50 to-election-navy" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <Award className="w-4 h-4 text-election-gold" />
                <span className="text-sm font-medium text-white">Trusted by 150+ Organizations</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The Future of
                <span className="block text-gradient-gold">Democratic Voting</span>
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-xl">
                Secure, transparent, and accessible online voting for elections of any scale. 
                From local associations to national referendums.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=register">
                  <Button variant="vote" size="xl" className="w-full sm:w-auto">
                    Start Voting Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-white/10">
                {[Lock, Shield, CheckCircle2].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-5 h-5 text-election-gold" />
                    <span className="text-sm text-white/70">
                      {["256-bit Encryption", "GDPR Compliant", "Verified Votes"][i]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 w-64 glass-card p-4 backdrop-blur-xl bg-white/10 border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-election-gold flex items-center justify-center">
                      <Users className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Total Voters</p>
                      <p className="text-2xl font-bold text-white">24,589</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-election-gold rounded-full"
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">78% turnout</p>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-10 w-56 glass-card p-4 backdrop-blur-xl bg-white/10 border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-white">Vote Confirmed</span>
                  </div>
                  <p className="text-xs text-white/60">Your vote was securely recorded</p>
                  <p className="text-xs text-election-gold mt-1">Transaction: #VT-2024-18392</p>
                </motion.div>

                {/* Main visual */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={heroImage}
                    alt="Secure Online Voting"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="relative py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ElectVote?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security meets user-friendly design for elections you can trust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 election-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Elections?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of organizations already using ElectVote for secure, transparent voting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="vote" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="glass" size="xl">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-election-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-election-gold flex items-center justify-center">
                <Vote className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-lg font-bold text-white">ElectVote</span>
            </div>
            <p className="text-sm text-white/60">
              © 2024 ElectVote. All rights reserved. Secure voting for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
