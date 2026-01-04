import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
  caption?: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: "https://cdn.siasat.com/wp-content/uploads/2024/06/PM-modi-and-Italian-counterpart-Giorgia-Meloni--660x495.jpg",
    alt: "प्रधानमंत्री श्री नरेन्द्र मोदी अंतर्राष्ट्रीय सम्मेलन में",
    caption: "भारत-इटली द्विपक्षीय वार्ता",
  },
  {
    id: 2,
    image: "https://images.bhaskarassets.com/web2images/521/2025/09/11/xhghgjhg1718295831_1757555326.png",
    alt: "राजनयिक बैठक",
    caption: "वैश्विक सहयोग को मजबूत करते हुए",
  },
  {
    id: 3,
    image: "https://akm-img-a-in.tosshub.com/aajtak/images/story/201703/modi_copy_1490769181_749x421.jpeg",
    alt: "प्रधानमंत्री का संबोधन",
    caption: "मित्रों, आपका स्वागत है",
  },
  {
    id: 4,
    image: "https://scrolldroll.com/wp-content/uploads/2021/09/khatam-tata-good-bye-rahul-gandhi-meme-template.jpg",
    alt: "राहुल गांधी संवाद",
    caption: "जनता के बीच नेता",
  },
  {
    id: 5,
    image: "https://i.ytimg.com/vi/opDLvgItFXw/oar2.jpg",
    alt: "वित्त मंत्री श्रीमती निर्मला सीतारमण",
    caption: "बजट और आर्थिक नीति",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch handlers for swipe support
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

  return (
    <section 
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Aspect ratio container - maintains 16:9 ratio */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-election-navy"
          >
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].alt}
              className="w-full h-full object-contain"
              loading={currentIndex === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlay - lighter to preserve image visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-election-navy/80 via-transparent to-election-navy/20" />
            
            {/* Caption */}
            {slides[currentIndex].caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-16 md:bottom-20 left-0 right-0 text-center px-4"
              >
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg bg-black/30 inline-block px-6 py-2 rounded-lg backdrop-blur-sm">
                  {slides[currentIndex].caption}
                </h2>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - positioned within aspect ratio container */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white border border-white/40 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white border border-white/40 shadow-lg"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 shadow-md ${
              index === currentIndex 
                ? "w-8 bg-election-gold" 
                : "w-2.5 bg-white/60 hover:bg-white/90"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
