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
  shape: "square" | "circle" | "triangle";
}

export function VoteSuccessAnimation({
  isVisible,
  candidateName,
  onClose,
}: VoteSuccessAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces with varied shapes
      const colors = ["#FF9933", "#138808", "#3b82f6", "#eab308", "#22c55e", "#f97316", "#ec4899", "#8b5cf6"];
      const shapes: ("square" | "circle" | "triangle")[] = ["square", "circle", "triangle"];
      const pieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < 80; i++) {
        // Distribute confetti more evenly from center
        const angle = (Math.PI * 2 * i) / 80;
        const distance = 200 + Math.random() * 300;
        pieces.push({
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 100, // Bias upward slightly
          rotation: Math.random() * 1080 - 540,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 6,
          delay: Math.random() * 0.3,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-election-navy/95 backdrop-blur-md"
        >
          {/* Confetti pieces - centered properly */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  opacity: [1, 1, 0.8, 0],
                  x: piece.x,
                  y: piece.y,
                  scale: [0, 1.5, 1],
                  rotate: piece.rotation,
                }}
                transition={{
                  duration: 3,
                  delay: piece.delay,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="absolute"
                style={{
                  backgroundColor: piece.shape !== "triangle" ? piece.color : "transparent",
                  width: piece.size,
                  height: piece.size,
                  borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "square" ? "2px" : 0,
                  borderLeft: piece.shape === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
                  borderRight: piece.shape === "triangle" ? `${piece.size / 2}px solid transparent` : undefined,
                  borderBottom: piece.shape === "triangle" ? `${piece.size}px solid ${piece.color}` : undefined,
                }}
              />
            ))}
          </div>

          {/* Burst rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: ring * 0.2,
                ease: "easeOut",
              }}
              className="absolute w-20 h-20 rounded-full border-4 border-election-gold"
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative text-center z-10"
          >
            {/* Success icon with glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mx-auto mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-election-gold/30 blur-xl"
              />
              
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-election-gold to-amber-500 flex items-center justify-center shadow-2xl glow-gold">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <PartyPopper className="w-5 h-5 text-election-gold" />
                <span className="text-lg font-medium text-election-gold">Success!</span>
                <Sparkles className="w-5 h-5 text-election-gold" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Vote Has Been Cast
              </h2>
              <p className="text-white/80 mb-2">
                You voted for <span className="font-semibold text-election-gold">{candidateName}</span>
              </p>
              <p className="text-white/60 text-sm mb-6">
                Your vote has been securely recorded.
              </p>

              <Button
                variant="glass"
                size="lg"
                onClick={onClose}
                className="min-w-[180px]"
              >
                View Results
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
