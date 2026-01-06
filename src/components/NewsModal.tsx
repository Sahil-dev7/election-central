import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  contentEn?: string;
  contentHi?: string;
}

interface NewsModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsModal({ news, isOpen, onClose }: NewsModalProps) {
  const { language, t } = useLanguage();

  if (!news) return null;

  const handleShare = async () => {
    const title = language === "hi" ? news.titleHi : news.titleEn;
    if (navigator.share) {
      await navigator.share({
        title,
        text: language === "hi" ? news.summaryHi : news.summaryEn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative w-full">
              <img
                src={news.image}
                alt={language === "hi" ? news.titleHi : news.titleEn}
                className="w-full h-auto max-h-[400px] object-contain bg-muted"
              />
              <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                {language === "hi" ? news.categoryHi : news.categoryEn}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{language === "hi" ? news.dateHi : news.dateEn}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  {language === "hi" ? "साझा करें" : "Share"}
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                {language === "hi" ? news.titleHi : news.titleEn}
              </h1>

              {/* Summary */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {language === "hi" ? news.summaryHi : news.summaryEn}
              </p>

              {/* Full Content */}
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-base leading-relaxed">
                  {language === "hi" 
                    ? (news.contentHi || `${news.summaryHi} यह खबर भारत के डिजिटल लोकतंत्र की दिशा में एक महत्वपूर्ण कदम है। ElectVote प्लेटफॉर्म का उद्देश्य मतदान प्रक्रिया को अधिक पारदर्शी और सुलभ बनाना है।`)
                    : (news.contentEn || `${news.summaryEn} This represents a significant step towards digital democracy in India. The ElectVote platform aims to make the voting process more transparent and accessible for all citizens.`)
                  }
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {language === "hi" ? "स्रोत: ElectVote न्यूज़" : "Source: ElectVote News"}
                </p>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {language === "hi" ? "पूरी खबर पढ़ें" : "Read Full Article"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
