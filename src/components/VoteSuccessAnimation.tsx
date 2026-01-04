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
      // Generate confetti pieces
      const colors = ["#FF9933", "#138808", "#3b82f6", "#eab308", "#22c55e", "#f97316"];
      const pieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: (Math.random() - 0.5) * 600,
          y: (Math.random() - 0.5) * 600,
          rotation: Math.random() * 720 - 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          delay: Math.random() * 0.5,
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
          {/* Confetti pieces */}
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
                opacity: [1, 1, 0],
                x: piece.x,
                y: piece.y,
                scale: [0, 1.2, 0.8],
                rotate: piece.rotation,
              }}
              transition={{
                duration: 2.5,
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-sm"
              style={{
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
              }}
            />
          ))}

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
