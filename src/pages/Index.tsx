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
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsSection } from "@/components/NewsSection";

const features = [
  {
    icon: Shield,
    title: "बैंक-स्तरीय सुरक्षा",
    description: "एंड-टू-एंड एन्क्रिप्शन और ब्लॉकचेन-सत्यापित वोट रिकॉर्ड पूर्ण अखंडता सुनिश्चित करते हैं।",
  },
  {
    icon: Fingerprint,
    title: "सत्यापित पहचान",
    description: "मल्टी-फैक्टर प्रमाणीकरण सुनिश्चित करता है कि केवल पात्र मतदाता ही भाग ले सकें।",
  },
  {
    icon: BarChart3,
    title: "लाइव परिणाम",
    description: "चुनाव के दौरान वास्तविक समय में मतगणना और विश्लेषण देखें।",
  },
  {
    icon: Globe,
    title: "कहीं से भी वोट करें",
    description: "किसी भी डिवाइस से, दुनिया में कहीं से भी सुरक्षित रूप से अपना मत डालें।",
  },
];

const stats = [
  { value: "20 लाख+", label: "वोट डाले गए" },
  { value: "500+", label: "चुनाव" },
  { value: "99.9%", label: "अपटाइम" },
  { value: "150+", label: "संगठन" },
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
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                विशेषताएं
              </a>
              <a href="#news" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                समाचार
              </a>
              <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                सुरक्षा
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">साइन इन</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="hero" size="sm">शुरू करें</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Carousel - First Fold */}
      <section className="pt-16">
        <HeroCarousel />
        
        {/* Hero Content Overlay */}
        <div className="relative -mt-32 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Award className="w-4 h-4 text-election-gold" />
              <span className="text-sm font-medium text-white">150+ संगठनों द्वारा विश्वसनीय</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              लोकतांत्रिक मतदान का
              <span className="block text-gradient-gold">भविष्य</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              किसी भी पैमाने के चुनावों के लिए सुरक्षित, पारदर्शी और सुलभ ऑनलाइन मतदान।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="vote" size="lg" className="w-full sm:w-auto">
                  अभी वोट करें
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  साइन इन करें
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-8">
              {[Lock, Shield, CheckCircle2].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-election-gold" />
                  <span className="text-xs text-white/70">
                    {["256-बिट एन्क्रिप्शन", "GDPR अनुपालन", "सत्यापित वोट"][i]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats section */}
      <section className="relative py-16 bg-background">
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
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news">
        <NewsSection />
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ElectVote क्यों चुनें?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              एंटरप्राइज-ग्रेड सुरक्षा उन चुनावों के लिए उपयोगकर्ता-अनुकूल डिज़ाइन से मिलती है जिन पर आप भरोसा कर सकते हैं।
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
      <section id="security" className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 election-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              अपने चुनावों को बदलने के लिए तैयार हैं?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              हजारों संगठन पहले से ही सुरक्षित, पारदर्शी मतदान के लिए ElectVote का उपयोग कर रहे हैं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button variant="vote" size="xl">
                  मुफ्त शुरू करें
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="glass" size="xl">
                  संपर्क करें
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
              © 2025 ElectVote. सर्वाधिकार सुरक्षित। सभी के लिए सुरक्षित मतदान।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
