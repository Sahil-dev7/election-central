import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Image */}
          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: scale, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-in rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Caption */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
              {alt}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing lightbox state
import { createContext, useContext, ReactNode } from "react";

interface LightboxContextType {
  openLightbox: (src: string, alt: string) => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return context;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const openLightbox = (src: string, alt: string) => {
    setImageSrc(src);
    setImageAlt(alt);
    setIsOpen(true);
  };

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      <ImageLightbox
        src={imageSrc}
        alt={imageAlt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </LightboxContext.Provider>
  );
}
