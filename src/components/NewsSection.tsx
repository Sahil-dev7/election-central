import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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

const demoNews: NewsItem[] = [
  {
    id: 1,
    titleEn: "Lok Sabha Elections 2025: EC Announces Schedule",
    titleHi: "लोकसभा चुनाव 2025: निर्वाचन आयोग ने तारीखों की घोषणा की",
    summaryEn: "Election Commission releases schedule for upcoming Lok Sabha elections. Voting to be held in 7 phases across all states.",
    summaryHi: "भारत निर्वाचन आयोग ने आगामी लोकसभा चुनावों के लिए कार्यक्रम जारी किया।",
    image: "https://cdn.siasat.com/wp-content/uploads/2024/06/PM-modi-and-Italian-counterpart-Giorgia-Meloni--660x495.jpg",
    categoryEn: "Elections",
    categoryHi: "चुनाव समाचार",
    dateEn: "2 hours ago",
    dateHi: "2 घंटे पहले",
  },
  {
    id: 2,
    titleEn: "EVM and VVPAT Security Enhanced",
    titleHi: "EVM और VVPAT की सुरक्षा पर विशेष ध्यान",
    summaryEn: "Election Commission issues new guidelines for EVM security. Three-tier security system to be implemented.",
    summaryHi: "निर्वाचन आयोग ने EVM मशीनों की सुरक्षा के लिए नई गाइडलाइंस जारी की हैं।",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcTGs8AFnjxC9acLoRDbQEdp2V_s-FIhNI2Ei05GB8yw&s=10",
    categoryEn: "Security",
    categoryHi: "सुरक्षा",
    dateEn: "5 hours ago",
    dateHi: "5 घंटे पहले",
  },
  {
    id: 3,
    titleEn: "40% Increase in Online Voter Registration",
    titleHi: "ऑनलाइन मतदाता पंजीकरण में 40% वृद्धि",
    summaryEn: "Record increase in online voter registration under Digital India initiative. Significant rise in young voters.",
    summaryHi: "डिजिटल इंडिया अभियान के तहत ऑनलाइन वोटर रजिस्ट्रेशन में रिकॉर्ड वृद्धि।",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqLc3cOys4_MzHXTDJANgnEtZngfTpmJEmlvDukw99S8X8UM626ab8lnt2&s=10",
    categoryEn: "Digital India",
    categoryHi: "डिजिटल भारत",
    dateEn: "1 day ago",
    dateHi: "1 दिन पहले",
  },
];

export function NewsSection() {
  const { language, t } = useLanguage();
  
  return (
    <section className="py-10 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t("news.title")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t("news.subtitle")}
          </p>
          
          <Badge variant="outline" className="mt-3 border-amber-500/50 text-amber-600 bg-amber-50 text-xs">
            📌 {t("news.demo")}
          </Badge>
        </motion.div>

        {/* News Grid - Compact */}
        <div className="grid md:grid-cols-3 gap-4">
          {demoNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border/50 hover:border-primary/30">
                <div className="relative bg-secondary">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={news.image}
                      alt={language === "hi" ? news.titleHi : news.titleEn}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      {language === "hi" ? news.categoryHi : news.categoryEn}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {language === "hi" ? news.titleHi : news.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {language === "hi" ? news.summaryHi : news.summaryEn}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      </div>
    </section>
  );
}
