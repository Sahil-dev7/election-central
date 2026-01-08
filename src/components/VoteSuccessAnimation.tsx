import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface VoteSuccessAnimationProps {
  isVisible: boolean;
  candidateName: string;
  onClose: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

export function VoteSuccessAnimation({
  isVisible,
  candidateName,
  onClose,
}: VoteSuccessAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces - centered from middle of screen
      const colors = ["#FF9933", "#138808", "#3b82f6", "#eab308", "#22c55e", "#f97316"];
      const pieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < 60; i++) {
        // Spread confetti more evenly and keep it centered
        const angle = (i / 60) * Math.PI * 2;
        const velocity = 150 + Math.random() * 150;
        pieces.push({
          id: i,
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity - 100, // Upward bias
          rotation: Math.random() * 720 - 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          delay: (i / 60) * 0.1,
        });
      }
      setConfetti(pieces);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          {/* Confetti pieces */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 0.8,
                rotate: 0,
              }}
              animate={{
                opacity: [1, 1, 0.5, 0],
                x: piece.x,
                y: piece.y + Math.random() * 200, // Add gravity
                scale: [0.8, 1.2, 1],
                rotate: piece.rotation,
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: -piece.size / 2,
                marginTop: -piece.size / 2,
              }}
            >
              <div
                className="rounded-sm"
                style={{
                  backgroundColor: piece.color,
                  width: piece.size,
                  height: piece.size,
                  boxShadow: `0 0 ${piece.size}px ${piece.color}80`,
                }}
              />
            </motion.div>
          ))}

          {/* Burst rings - subtle */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={`ring-${ring}`}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: ring * 0.15,
                ease: "easeOut",
              }}
              className="absolute rounded-full border-2 border-election-gold"
              style={{
                width: 40,
                height: 40,
                left: "50%",
                top: "50%",
                marginLeft: -20,
                marginTop: -20,
              }}
            />
          ))}

          {/* Main content card - centered */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-10 bg-background border-2 border-election-gold rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-election-gold/20 via-election-gold/10 to-election-gold/20 rounded-2xl blur-xl -z-10" />

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-election-gold/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-election-gold" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-election-gold"
                />
              </div>
            </motion.div>

            {/* Text content */}
            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              आपका वोट दर्ज हो गया!
            </h2>
            <p className="text-center text-lg font-semibold text-election-gold mb-4">
              Your Vote Matters
            </p>

            <p className="text-center text-muted-foreground mb-2">
              धन्यवाद <span className="text-foreground font-semibold">{candidateName}</span> को वोट देने के लिए
            </p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Thank you for voting! Your voice has been recorded.
            </p>

            {/* Decorative sparkles */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                >
                  <Sparkles className="w-5 h-5 text-election-gold" />
                </motion.div>
              ))}
            </div>

            {/* Close button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={onClose}
                className="w-full bg-election-gold hover:bg-election-gold/90 text-foreground font-semibold py-6"
              >
                आगे बढ़ें / Continue
              </Button>
            </motion.div>

            {/* Small footer text */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              You can download your vote receipt from the dashboard
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
