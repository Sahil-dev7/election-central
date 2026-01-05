import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarouselSlide {
  id: number;
  image: string;
  altEn: string;
  altHi: string;
  captionEn?: string;
  captionHi?: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: "https://cdn.siasat.com/wp-content/uploads/2024/06/PM-modi-and-Italian-counterpart-Giorgia-Meloni--660x495.jpg",
    altEn: "PM Modi at International Summit",
    altHi: "प्रधानमंत्री मोदी अंतर्राष्ट्रीय सम्मेलन में",
    captionEn: "India-Italy Bilateral Talks",
    captionHi: "भारत-इटली द्विपक्षीय वार्ता",
  },
  {
    id: 2,
    image: "https://akm-img-a-in.tosshub.com/aajtak/images/story/201703/modi_copy_1490769181_749x421.jpeg",
    altEn: "PM Modi's Address",
    altHi: "प्रधानमंत्री का संबोधन",
    captionEn: "Welcome Friends",
    captionHi: "मित्रों, आपका स्वागत है",
  },
  {
    id: 3,
    image: "https://i.ytimg.com/vi/opDLvgItFXw/oar2.jpg",
    altEn: "Finance Minister Nirmala Sitharaman",
    altHi: "वित्त मंत्री श्रीमती निर्मला सीतारमण",
    captionEn: "Budget & Economic Policy",
    captionHi: "बजट और आर्थिक नीति",
  },
  {
    id: 4,
    image: "https://images.bhaskarassets.com/thumb/1200x900/web2images/521/2022/09/07/renaissance-730x548-1_1662533070.jpg",
    altEn: "Swapnil Kothari - Congress Leader",
    altHi: "स्वप्निल कोठारी - कांग्रेस नेता",
    captionEn: "Youth Politics",
    captionHi: "युवा राजनीति",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { language } = useLanguage();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentSlide = slides[currentIndex];
  const alt = language === "hi" ? currentSlide.altHi : currentSlide.altEn;
  const caption = language === "hi" ? currentSlide.captionHi : currentSlide.captionEn;

  return (
    <div 
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image container - auto height based on image aspect ratio */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full bg-election-navy"
          >
            {/* Image with natural aspect ratio - NO CROPPING */}
            <img
              src={currentSlide.image}
              alt={alt}
              className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              loading={currentIndex === 0 ? "eager" : "lazy"}
              style={{ display: 'block' }}
            />
            
            {/* Gradient overlay at bottom for caption */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-election-navy via-election-navy/60 to-transparent" />
            
            {/* Caption */}
            {caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-16 left-0 right-0 text-center px-4"
              >
                <span className="text-base md:text-lg font-semibold text-white drop-shadow-lg bg-black/50 px-4 py-2 rounded-lg inline-block">
                  {caption}
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "w-6 bg-election-gold" 
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
