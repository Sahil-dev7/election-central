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
  const { t } = useLanguage();
  
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
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">ElectVote</span>
                <span className="text-[10px] text-muted-foreground leading-none">{t("general.tagline")}</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-4">
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

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">{t("nav.signIn")}</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button variant="hero" size="sm" className="shadow-md">{t("nav.getStarted")}</Button>
                </Link>
              </div>
              
              <Link to="/auth" className="sm:hidden">
                <Button variant="hero" size="sm">{t("nav.login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Carousel */}
      <section className="pt-14">
        <HeroCarousel />
        
        {/* Hero Content Overlay - Fixed positioning */}
        <div className="relative -mt-40 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              {t("hero.democratic")}
              <span className="block text-gradient-gold">{t("hero.future")}</span>
            </h1>

            <p className="text-sm md:text-base text-white/80 mb-4 max-w-xl mx-auto">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="vote" size="default" className="w-full sm:w-auto">
                  {t("hero.voteNow")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="glass" size="default" className="w-full sm:w-auto">
                  {t("hero.signInBtn")}
                </Button>
              </Link>
            </div>

            {/* Trust badges - compact */}
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              {[Lock, Shield, CheckCircle2].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3 text-election-gold" />
                  <span className="text-[10px] text-white/70">
                    {[t("trust.encryption"), t("trust.gdpr"), t("trust.verified")][i]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats section - Compact */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news">
        <NewsSection />
      </section>

      {/* Features section - Compact */}
      <section id="features" className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("features.title")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-elevated p-4"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section id="security" className="py-12 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 election-pattern" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t("cta.title")}
            </h2>
            <p className="text-sm text-white/80 mb-6">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="vote" size="lg">
                  {t("cta.free")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="glass" size="lg">
                  {t("cta.contact")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Compact */}
      <footer className="py-6 bg-election-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-election-gold flex items-center justify-center">
                <Vote className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">ElectVote</span>
                <span className="text-[10px] text-white/60">{t("general.tagline")}</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
