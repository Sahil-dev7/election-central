import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Vote, 
  Shield, 
  BarChart3, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Globe,
  Fingerprint,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsSection } from "@/components/NewsSection";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-secondary"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default function Index() {
  const { language, t } = useLanguage();
  
  const features = [
    {
      icon: Shield,
      title: t("features.security.title"),
      description: t("features.security.desc"),
    },
    {
      icon: Fingerprint,
      title: t("features.identity.title"),
      description: t("features.identity.desc"),
    },
    {
      icon: BarChart3,
      title: t("features.results.title"),
      description: t("features.results.desc"),
    },
    {
      icon: Globe,
      title: t("features.anywhere.title"),
      description: t("features.anywhere.desc"),
    },
  ];

  const stats = [
    { value: "20L+", label: t("stats.votesCast") },
    { value: "500+", label: t("stats.elections") },
    { value: "99.9%", label: t("stats.uptime") },
    { value: "150+", label: t("stats.organizations") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Fixed Header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-foreground leading-tight">ElectVote</span>
                <span className="text-[9px] text-muted-foreground leading-none">{t("general.tagline")}</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t("nav.features")}
              </a>
              <a href="#news" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t("nav.news")}
              </a>
              <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t("nav.security")}
              </a>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="h-8">{t("nav.signIn")}</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm" className="h-8 gradient-primary text-white border-0">{t("nav.getStarted")}</Button>
                </Link>
              </div>
              
              <Link to="/auth" className="sm:hidden">
                <Button size="sm" className="h-8 gradient-primary text-white border-0">{t("nav.login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content - Properly spaced sections */}
      <main className="pt-14">
        
        {/* Hero Carousel Section */}
        <section className="bg-election-navy">
          <HeroCarousel />
        </section>

        {/* Hero Content - Separate section, no overlap */}
        <section className="py-10 gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                {t("hero.democratic")}
                <span className="block text-gradient-gold mt-1">{t("hero.future")}</span>
              </h1>

              <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link to="/auth?mode=register">
                  <Button size="lg" className="w-full sm:w-auto gradient-gold text-foreground font-semibold border-0 shadow-lg hover:shadow-xl transition-shadow">
                    {t("hero.voteNow")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
                    {t("hero.signInBtn")}
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {[
                  { icon: Lock, label: t("trust.encryption") },
                  { icon: Shield, label: t("trust.gdpr") },
                  { icon: CheckCircle2, label: t("trust.verified") }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-1.5"
                  >
                    <item.icon className="w-3.5 h-3.5 text-election-gold" />
                    <span className="text-xs text-white/70">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Separate section */}
        <section className="py-10 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card border border-border/50"
                >
                  <p className="text-xl md:text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="news">
          <NewsSection />
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {t("features.title")}
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                {t("features.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="security" className="py-12 gradient-hero">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                {t("cta.title")}
              </h2>
              <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/auth?mode=register">
                  <Button size="lg" className="w-full sm:w-auto gradient-gold text-foreground font-semibold border-0">
                    {t("cta.free")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="mailto:sahilwadhwani712@gmail.com">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
                    {t("cta.contact")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-election-navy border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
                <Vote className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">ElectVote</span>
                <span className="text-[9px] text-white/60">{t("general.tagline")}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/developers" className="text-xs text-white/60 hover:text-white transition-colors">
                {language === "hi" ? "डेवलपर्स" : "Developers"}
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/60">
              © 2025 ElectVote. All images and data rights reserved by Renaissance University owner project college
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
