import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
  isDemo: boolean;
}

const demoNews: NewsItem[] = [
  {
    id: 1,
    title: "लोकसभा चुनाव 2025: निर्वाचन आयोग ने तारीखों की घोषणा की",
    summary: "भारत निर्वाचन आयोग ने आगामी लोकसभा चुनावों के लिए कार्यक्रम जारी किया। सभी राज्यों में मतदान 7 चरणों में होगा।",
    image: "https://cdn.siasat.com/wp-content/uploads/2024/06/PM-modi-and-Italian-counterpart-Giorgia-Meloni--660x495.jpg",
    category: "चुनाव समाचार",
    date: "2 घंटे पहले",
    isDemo: true,
  },
  {
    id: 2,
    title: "EVM और VVPAT की सुरक्षा पर विशेष ध्यान",
    summary: "निर्वाचन आयोग ने EVM मशीनों की सुरक्षा के लिए नई गाइडलाइंस जारी की हैं। तीन स्तरीय सुरक्षा व्यवस्था लागू होगी।",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcTGs8AFnjxC9acLoRDbQEdp2V_s-FIhNI2Ei05GB8yw&s=10",
    category: "सुरक्षा",
    date: "5 घंटे पहले",
    isDemo: true,
  },
  {
    id: 3,
    title: "ऑनलाइन मतदाता पंजीकरण में 40% वृद्धि",
    summary: "डिजिटल इंडिया अभियान के तहत ऑनलाइन वोटर रजिस्ट्रेशन में रिकॉर्ड वृद्धि। युवा मतदाताओं की संख्या में उल्लेखनीय बढ़ोतरी।",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqLc3cOys4_MzHXTDJANgnEtZngfTpmJEmlvDukw99S8X8UM626ab8lnt2&s=10",
    category: "डिजिटल भारत",
    date: "1 दिन पहले",
    isDemo: true,
  },
  {
    id: 4,
    title: "मतदाता जागरूकता अभियान शुरू",
    summary: "निर्वाचन आयोग ने 'मेरा वोट, मेरी शक्ति' अभियान की शुरुआत की। सभी जिलों में विशेष कार्यक्रम आयोजित किए जाएंगे।",
    image: "https://akm-img-a-in.tosshub.com/aajtak/images/story/201703/modi_copy_1490769181_749x421.jpeg",
    category: "जागरूकता",
    date: "2 दिन पहले",
    isDemo: true,
  },
  {
    id: 5,
    title: "नगर निकाय चुनाव: उम्मीदवारों की घोषणा",
    summary: "विभिन्न दलों ने नगर निकाय चुनावों के लिए अपने उम्मीदवारों की सूची जारी की। महिला उम्मीदवारों की संख्या में वृद्धि।",
    image: "https://i.ytimg.com/vi/opDLvgItFXw/oar2.jpg",
    category: "स्थानीय चुनाव",
    date: "3 दिन पहले",
    isDemo: true,
  },
  {
    id: 6,
    title: "वोटिंग ऐप से मतदान केंद्र की जानकारी",
    summary: "नए वोटर हेल्पलाइन ऐप से मतदाता अपने नजदीकी मतदान केंद्र और कतार की स्थिति देख सकते हैं।",
    image: "https://scrolldroll.com/wp-content/uploads/2021/09/khatam-tata-good-bye-rahul-gandhi-meme-template.jpg",
    category: "तकनीक",
    date: "4 दिन पहले",
    isDemo: true,
  },
];

export function NewsSection() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">समाचार एवं अपडेट</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            चुनाव समाचार और हाइलाइट्स
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            भारत निर्वाचन आयोग और चुनावी प्रक्रिया से जुड़ी ताज़ा खबरें
          </p>
          
          {/* Demo Notice */}
          <Badge variant="outline" className="mt-4 border-amber-500/50 text-amber-600 bg-amber-50">
            📌 नमूना समाचार - केवल प्रदर्शन हेतु
          </Badge>
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {news.category}
                    </Badge>
                  </div>
                  {news.isDemo && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        DEMO
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{news.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>पढ़ें</span>
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
