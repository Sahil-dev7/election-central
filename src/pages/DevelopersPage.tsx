import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Github, Linkedin, Mail, Vote, Star, Award, Sparkles, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState } from "react";
import { ImageLightbox } from "@/components/ImageLightbox";

import devSahilImg from "@/assets/dev-sahil.jpg";
import devRoshanImg from "@/assets/dev-roshan.jpg";
import devSakshiImg from "@/assets/dev-sakshi.jpg";
import devRishikaImg from "@/assets/dev-rishika.jpg";

const developers = [
  {
    name: "Sahil Wadhwani",
    nameHi: "साहिल वाधवानी",
    role: "Lead Full Stack Developer & Project Head",
    roleHi: "लीड फुल स्टैक डेवलपर और प्रोजेक्ट हेड",
    photo: devSahilImg,
    description: "Visionary leader who architected the entire ElectVote platform. Designed the database schema, built all core APIs, implemented security protocols, and led the team through every challenge. His dedication and 18-hour coding sessions made this project possible.",
    descriptionHi: "दूरदर्शी नेता जिन्होंने पूरे ElectVote प्लेटफॉर्म को डिज़ाइन किया। डेटाबेस स्कीमा डिज़ाइन किया, सभी कोर API बनाए, सुरक्षा प्रोटोकॉल लागू किए, और हर चुनौती में टीम का नेतृत्व किया। उनके समर्पण और 18 घंटे की कोडिंग सेशन ने इस प्रोजेक्ट को संभव बनाया।",
    contributions: [
      "System Architecture & Database Design",
      "Backend APIs & Authentication",
      "Security Implementation",
      "Team Leadership & Code Review",
      "DevOps & Deployment"
    ],
    contributionsHi: [
      "सिस्टम आर्किटेक्चर और डेटाबेस डिज़ाइन",
      "बैकएंड API और प्रमाणीकरण",
      "सुरक्षा कार्यान्वयन",
      "टीम नेतृत्व और कोड रिव्यू",
      "DevOps और डिप्लॉयमेंट"
    ],
    isLead: true,
  },
  {
    name: "Roshan Sharma",
    nameHi: "रोशन शर्मा",
    role: "Backend Developer",
    roleHi: "बैकएंड डेवलपर",
    photo: devRoshanImg,
    description: "Database optimization expert who helped build robust data models. Worked closely with Sahil on API development and testing.",
    descriptionHi: "डेटाबेस ऑप्टिमाइज़ेशन विशेषज्ञ जिन्होंने मजबूत डेटा मॉडल बनाने में मदद की। API विकास और परीक्षण पर साहिल के साथ मिलकर काम किया।",
    contributions: [
      "Database Queries Optimization",
      "API Testing & Documentation",
      "Data Validation Logic"
    ],
    contributionsHi: [
      "डेटाबेस क्वेरी ऑप्टिमाइज़ेशन",
      "API परीक्षण और दस्तावेज़ीकरण",
      "डेटा वैलिडेशन लॉजिक"
    ],
    isLead: false,
  },
  {
    name: "Sakshi Kachre",
    nameHi: "साक्षी कचरे",
    role: "UI/UX Designer",
    roleHi: "UI/UX डिज़ाइनर",
    photo: devSakshiImg,
    description: "Creative designer who crafted the visual identity of ElectVote. Created wireframes, mockups, and design system components.",
    descriptionHi: "रचनात्मक डिज़ाइनर जिन्होंने ElectVote की विज़ुअल पहचान बनाई। वायरफ्रेम, मॉकअप और डिज़ाइन सिस्टम कंपोनेंट बनाए।",
    contributions: [
      "UI/UX Design & Wireframes",
      "Color Scheme & Typography",
      "User Flow Diagrams"
    ],
    contributionsHi: [
      "UI/UX डिज़ाइन और वायरफ्रेम",
      "रंग योजना और टाइपोग्राफी",
      "उपयोगकर्ता प्रवाह आरेख"
    ],
    isLead: false,
  },
  {
    name: "Rishika Yadav",
    nameHi: "ऋषिका यादव",
    role: "Frontend Developer",
    roleHi: "फ्रंटएंड डेवलपर",
    photo: devRishikaImg,
    description: "React specialist who implemented responsive components and animations. Ensured pixel-perfect designs across all devices.",
    descriptionHi: "React विशेषज्ञ जिन्होंने रेस्पॉन्सिव कंपोनेंट और एनिमेशन लागू किए। सभी डिवाइस पर पिक्सेल-परफेक्ट डिज़ाइन सुनिश्चित किया।",
    contributions: [
      "React Components Development",
      "Responsive Design Implementation",
      "Animation & Transitions"
    ],
    contributionsHi: [
      "React कंपोनेंट विकास",
      "रेस्पॉन्सिव डिज़ाइन कार्यान्वयन",
      "एनिमेशन और ट्रांज़िशन"
    ],
    isLead: false,
  },
];

export default function DevelopersPage() {
  const { language, t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: "", alt: "" });

  const openImageLightbox = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
    setLightboxOpen(true);
  };

  const leadDev = developers[0];
  const teamMembers = developers.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {language === "hi" ? "हमारी प्रतिभाशाली टीम" : "Meet Our Brilliant Team"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {language === "hi" 
                ? "चार प्रतिभाशाली डेवलपर्स जिन्होंने अपनी मेहनत, लगन और समर्पण से ElectVote को साकार किया। यह प्रोजेक्ट उनकी अथक मेहनत का परिणाम है।"
                : "Four talented developers who brought ElectVote to life through their hard work, dedication, and countless hours of coding. This project is a result of their tireless efforts and passion."}
            </p>
          </motion.div>

          {/* Team Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === "hi" 
                  ? "एकता में शक्ति, कोड में जुनून"
                  : "Unity in Strength, Passion in Code"}
              </span>
              <Heart className="w-4 h-4 text-primary" />
            </div>
          </motion.div>

          {/* Lead Developer - Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border-2 border-primary/30 p-8 md:p-10">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                  <Star className="w-3 h-3 mr-1" />
                  {language === "hi" ? "प्रोजेक्ट लीड" : "Project Lead"}
                </Badge>
              </div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Photo */}
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => openImageLightbox(leadDev.photo, leadDev.name)}
                >
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 group-hover:border-primary/50 transition-all">
                    <img 
                      src={leadDev.photo} 
                      alt={leadDev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {language === "hi" ? leadDev.nameHi : leadDev.name}
                  </h2>
                  <p className="text-primary font-semibold mb-4">
                    {language === "hi" ? leadDev.roleHi : leadDev.role}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {language === "hi" ? leadDev.descriptionHi : leadDev.description}
                  </p>

                  {/* Contributions */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {(language === "hi" ? leadDev.contributionsHi : leadDev.contributions).map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {item}
                      </Badge>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-full"
                      onClick={() => window.open("mailto:sahilwadhwani712@gmail.com")}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">
              {language === "hi" ? "टीम के सदस्य" : "Team Members"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "hi" 
                ? "साथ मिलकर बड़े सपनों को साकार करने वाले"
                : "Together, making big dreams come true"}
            </p>
          </motion.div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div 
                  className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border mx-auto mb-4 cursor-pointer group"
                  onClick={() => openImageLightbox(dev.photo, dev.name)}
                >
                  <img 
                    src={dev.photo} 
                    alt={dev.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground text-center">
                  {language === "hi" ? dev.nameHi : dev.name}
                </h3>
                <p className="text-sm font-medium text-primary text-center mb-3">
                  {language === "hi" ? dev.roleHi : dev.role}
                </p>
                <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
                  {language === "hi" ? dev.descriptionHi : dev.description}
                </p>

                {/* Contributions */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {(language === "hi" ? dev.contributionsHi : dev.contributions).map((item, j) => (
                    <Badge key={j} variant="outline" className="text-[10px] px-2 py-0.5">
                      {item}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 mt-4 justify-center">
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
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-election-navy to-primary/80 p-8 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMNDAgMjBMNDAgNDBMMjAgNDBMMjAgMjBaIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />
              <div className="relative">
                <Code className="w-12 h-12 text-white/80 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {language === "hi" ? "रेनेसां विश्वविद्यालय, इंदौर" : "Renaissance University, Indore"}
                </h2>
                <p className="text-white/80 mb-4 max-w-lg mx-auto">
                  {language === "hi" 
                    ? "यह प्रोजेक्ट रेनेसां विश्वविद्यालय के कंप्यूटर साइंस एंड इंजीनियरिंग विभाग के छात्रों द्वारा गर्व से विकसित किया गया है।"
                    : "This project is proudly developed by students of the Department of Computer Science & Engineering at Renaissance University."}
                </p>
                <Badge className="bg-white/20 text-white border-white/30">
                  {language === "hi" ? "कंप्यूटर साइंस एंड इंजीनियरिंग विभाग" : "Department of Computer Science & Engineering"}
                </Badge>
              </div>
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

      {/* Image Lightbox */}
      <ImageLightbox 
        src={lightboxImage.src}
        alt={lightboxImage.alt}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
