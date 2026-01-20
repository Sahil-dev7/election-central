import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsModal } from "./NewsModal";
import { useLightbox } from "./ImageLightbox";

import newsRenaissanceImg from "@/assets/news-renaissance.png";

interface NewsItem {
  id: number;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  image: string;
  categoryEn: string;
  categoryHi: string;
  dateEn: string;
  dateHi: string;
}

// Hero carousel images integrated into news
const demoNews: NewsItem[] = [
  {
    id: 1,
    titleEn: "Renaissance University Students Launch ElectVote Platform",
    titleHi: "रेनेसां विश्वविद्यालय के छात्रों ने ElectVote प्लेटफॉर्म लॉन्च किया",
    summaryEn: "Students from Renaissance University, Indore have developed a secure digital voting platform to modernize democratic processes.",
    summaryHi: "इंदौर के रेनेसां विश्वविद्यालय के छात्रों ने लोकतांत्रिक प्रक्रियाओं को आधुनिक बनाने के लिए एक सुरक्षित डिजिटल मतदान प्लेटफॉर्म विकसित किया है।",
    image: newsRenaissanceImg,
    categoryEn: "Technology",
    categoryHi: "प्रौद्योगिकी",
    dateEn: "2 hours ago",
    dateHi: "2 घंटे पहले",
  },
  {
    id: 2,
    titleEn: "PM Modi at India-Italy Bilateral Summit",
    titleHi: "प्रधानमंत्री मोदी भारत-इटली द्विपक्षीय शिखर सम्मेलन में",
    summaryEn: "Prime Minister Narendra Modi meets Italian counterpart Giorgia Meloni for strengthening bilateral ties and trade relations.",
    summaryHi: "प्रधानमंत्री नरेंद्र मोदी ने द्विपक्षीय संबंधों और व्यापार संबंधों को मजबूत करने के लिए इतालवी समकक्ष जॉर्जिया मेलोनी से मुलाकात की।",
    image: "https://cdn.siasat.com/wp-content/uploads/2024/06/PM-modi-and-Italian-counterpart-Giorgia-Meloni--660x495.jpg",
    categoryEn: "International",
    categoryHi: "अंतर्राष्ट्रीय",
    dateEn: "3 hours ago",
    dateHi: "3 घंटे पहले",
  },
  {
    id: 3,
    titleEn: "Lok Sabha Elections 2025: EC Announces Schedule",
    titleHi: "लोकसभा चुनाव 2025: निर्वाचन आयोग ने तारीखों की घोषणा की",
    summaryEn: "Election Commission releases schedule for upcoming Lok Sabha elections. Voting to be held in 7 phases across all states.",
    summaryHi: "भारत निर्वाचन आयोग ने आगामी लोकसभा चुनावों के लिए कार्यक्रम जारी किया। सभी राज्यों में 7 चरणों में मतदान होगा।",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&h=400&fit=crop",
    categoryEn: "Elections",
    categoryHi: "चुनाव समाचार",
    dateEn: "5 hours ago",
    dateHi: "5 घंटे पहले",
  },
  {
    id: 4,
    titleEn: "Youth in Politics: Swapnil Kothari's Journey",
    titleHi: "राजनीति में युवा: स्वप्निल कोठारी की यात्रा",
    summaryEn: "Young political leader Swapnil Kothari from Congress shares his vision for youth empowerment and digital democracy.",
    summaryHi: "कांग्रेस के युवा राजनीतिक नेता स्वप्निल कोठारी ने युवा सशक्तिकरण और डिजिटल लोकतंत्र के लिए अपना दृष्टिकोण साझा किया।",
    image: "https://images.bhaskarassets.com/thumb/1200x900/web2images/521/2022/09/07/renaissance-730x548-1_1662533070.jpg",
    categoryEn: "Youth",
    categoryHi: "युवा",
    dateEn: "1 day ago",
    dateHi: "1 दिन पहले",
  },
  {
    id: 5,
    titleEn: "40% Increase in Online Voter Registration",
    titleHi: "ऑनलाइन मतदाता पंजीकरण में 40% वृद्धि",
    summaryEn: "Record increase in online voter registration under Digital India initiative. Significant rise in young voters.",
    summaryHi: "डिजिटल इंडिया अभियान के तहत ऑनलाइन वोटर रजिस्ट्रेशन में रिकॉर्ड वृद्धि। युवा मतदाताओं में उल्लेखनीय वृद्धि।",
    image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=600&h=400&fit=crop",
    categoryEn: "Digital India",
    categoryHi: "डिजिटल भारत",
    dateEn: "1 day ago",
    dateHi: "1 दिन पहले",
  },
  {
    id: 6,
    titleEn: "EVM Security Enhanced with New Technology",
    titleHi: "नई तकनीक से EVM सुरक्षा में वृद्धि",
    summaryEn: "Election Commission introduces advanced security features in Electronic Voting Machines to ensure tamper-proof elections.",
    summaryHi: "निर्वाचन आयोग ने छेड़छाड़-रोधी चुनाव सुनिश्चित करने के लिए इलेक्ट्रॉनिक वोटिंग मशीनों में उन्नत सुरक्षा सुविधाएं पेश कीं।",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&h=400&fit=crop",
    categoryEn: "Security",
    categoryHi: "सुरक्षा",
    dateEn: "2 days ago",
    dateHi: "2 दिन पहले",
  },
  {
    id: 7,
    titleEn: "Youth Voter Turnout Hits Record High",
    titleHi: "युवा मतदाता मतदान रिकॉर्ड ऊंचाई पर",
    summaryEn: "First-time voters show unprecedented enthusiasm with 78% participation rate in recent state elections.",
    summaryHi: "पहली बार मतदाताओं ने हाल के राज्य चुनावों में 78% भागीदारी दर के साथ अभूतपूर्व उत्साह दिखाया।",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    categoryEn: "Youth",
    categoryHi: "युवा",
    dateEn: "3 days ago",
    dateHi: "3 दिन पहले",
  },
];

export function NewsSection() {
  const { language, t } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  let lightbox: { openLightbox: (src: string, alt: string) => void } | null = null;
  try {
    lightbox = useLightbox();
  } catch {
    // Lightbox not available
  }

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleImageClick = (e: React.MouseEvent, news: NewsItem) => {
    e.stopPropagation();
    if (lightbox) {
      lightbox.openLightbox(news.image, language === "hi" ? news.titleHi : news.titleEn);
    }
  };
  
  return (
    <>
      <section className="py-12 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 mb-3">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">{t("news.badge")}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {t("news.title")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("news.subtitle")}
            </p>
          </motion.div>

          {/* News Grid - Show first 4 news */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoNews.slice(0, 4).map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-border/50 hover:border-primary/30 bg-card"
                  onClick={() => handleNewsClick(news)}
                >
                  {/* Image container */}
                  <div 
                    className="relative bg-muted"
                    onClick={(e) => handleImageClick(e, news)}
                  >
                    <div className="w-full overflow-hidden">
                      <img
                        src={news.image}
                        alt={language === "hi" ? news.titleHi : news.titleEn}
                        className="w-full h-auto max-h-48 object-contain bg-muted group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary/90 text-primary-foreground text-xs">
                        {language === "hi" ? news.categoryHi : news.categoryEn}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {language === "hi" ? news.titleHi : news.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                      {language === "hi" ? news.summaryHi : news.summaryEn}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{language === "hi" ? news.dateHi : news.dateEn}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t("news.read")}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* More News Row - Show remaining news */}
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {demoNews.slice(4).map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-border/50 hover:border-primary/30 bg-card flex flex-row"
                  onClick={() => handleNewsClick(news)}
                >
                  {/* Image */}
                  <div 
                    className="relative bg-muted w-32 flex-shrink-0"
                    onClick={(e) => handleImageClick(e, news)}
                  >
                    <img
                      src={news.image}
                      alt={language === "hi" ? news.titleHi : news.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs mb-2">
                      {language === "hi" ? news.categoryHi : news.categoryEn}
                    </Badge>
                    <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {language === "hi" ? news.titleHi : news.titleEn}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{language === "hi" ? news.dateHi : news.dateEn}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Detail Modal */}
      <NewsModal 
        news={selectedNews} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
