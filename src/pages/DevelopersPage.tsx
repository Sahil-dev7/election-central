import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Github, Linkedin, Mail, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

import devSahilImg from "@/assets/dev-sahil.jpg";
import devRoshanImg from "@/assets/dev-roshan.jpg";
import devSakshiImg from "@/assets/dev-sakshi.jpg";
import devRishikaImg from "@/assets/dev-rishika.jpg";

const developers = [
  {
    name: "Sahil Wadhwani",
    nameHi: "साहिल वाधवानी",
    role: "Full Stack Developer",
    roleHi: "फुल स्टैक डेवलपर",
    photo: devSahilImg,
    description: "Passionate about building scalable web applications and user-friendly interfaces.",
    descriptionHi: "स्केलेबल वेब एप्लिकेशन और उपयोगकर्ता-अनुकूल इंटरफेस बनाने के लिए उत्साही।",
  },
  {
    name: "Roshan Sharma",
    nameHi: "रोशन शर्मा",
    role: "Backend Developer",
    roleHi: "बैकएंड डेवलपर",
    photo: devRoshanImg,
    description: "Expert in database design and API development with focus on security.",
    descriptionHi: "सुरक्षा पर ध्यान केंद्रित करते हुए डेटाबेस डिजाइन और API विकास में विशेषज्ञ।",
  },
  {
    name: "Sakshi Kachre",
    nameHi: "साक्षी कचरे",
    role: "UI/UX Designer",
    roleHi: "UI/UX डिजाइनर",
    photo: devSakshiImg,
    description: "Creating beautiful and intuitive user experiences that delight users.",
    descriptionHi: "सुंदर और सहज उपयोगकर्ता अनुभव बनाना जो उपयोगकर्ताओं को प्रसन्न करते हैं।",
  },
  {
    name: "Rishika Yadav",
    nameHi: "ऋषिका यादव",
    role: "Frontend Developer",
    roleHi: "फ्रंटएंड डेवलपर",
    photo: devRishikaImg,
    description: "Specialized in React and modern JavaScript frameworks with pixel-perfect designs.",
    descriptionHi: "पिक्सेल-परफेक्ट डिजाइन के साथ React और आधुनिक JavaScript फ्रेमवर्क में विशेषज्ञता।",
  },
];

export default function DevelopersPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-foreground leading-tight">ElectVote</span>
                <span className="text-[9px] text-muted-foreground leading-none">{t("general.tagline")}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Link to="/">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  {language === "hi" ? "वापस" : "Back"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === "hi" ? "हमारी टीम" : "Our Development Team"}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {language === "hi" 
                ? "ElectVote के पीछे प्रतिभाशाली डेवलपर्स से मिलें"
                : "Meet the talented developers behind ElectVote"}
            </p>
          </motion.div>

          {/* Developers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {developers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-elevated p-6 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 mb-4 shadow-lg">
                  <img 
                    src={dev.photo} 
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {language === "hi" ? dev.nameHi : dev.name}
                </h3>
                <p className="text-sm font-medium text-primary mb-2">
                  {language === "hi" ? dev.roleHi : dev.role}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "hi" ? dev.descriptionHi : dev.description}
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Renaissance University Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {language === "hi" ? "रेनेसां विश्वविद्यालय" : "Renaissance University"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "hi" 
                  ? "यह प्रोजेक्ट रेनेसां विश्वविद्यालय, इंदौर के छात्रों द्वारा विकसित किया गया है"
                  : "This project is developed by students of Renaissance University, Indore"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "hi" 
                  ? "कंप्यूटर साइंस एंड इंजीनियरिंग विभाग"
                  : "Department of Computer Science & Engineering"}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-election-navy border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-white/60">
            © 2025 ElectVote. All images and data rights reserved by Renaissance University owner project college
          </p>
        </div>
      </footer>
    </div>
  );
}
