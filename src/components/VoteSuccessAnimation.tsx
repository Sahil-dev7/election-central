import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoteSuccessAnimationProps {
  isVisible: boolean;
  candidateName: string;
  onClose: () => void;
}

export function VoteSuccessAnimation({
  isVisible,
  candidateName,
  onClose,
}: VoteSuccessAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-election-navy/90 backdrop-blur-md"
        >
          {/* Confetti particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 0,
              }}
              animate={{
                opacity: [1, 1, 0],
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: [0, 1, 0.5],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: ["#eab308", "#3b82f6", "#22c55e", "#f97316"][Math.floor(Math.random() * 4)],
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mx-auto mb-6"
            >
              {/* Pulse rings */}
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-election-gold/30"
              />
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-election-gold/20"
              />
              
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-election-gold to-amber-500 flex items-center justify-center shadow-2xl">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
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
                <PartyPopper className="w-6 h-6 text-election-gold" />
                <span className="text-lg font-medium text-election-gold">Success!</span>
                <Sparkles className="w-6 h-6 text-election-gold" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Vote Has Been Cast
              </h2>
              <p className="text-white/80 text-lg mb-2">
                You voted for <span className="font-semibold text-election-gold">{candidateName}</span>
              </p>
              <p className="text-white/60 text-sm mb-8">
                Your vote has been securely recorded and cannot be modified.
              </p>

              <Button
                variant="glass"
                size="lg"
                onClick={onClose}
                className="min-w-[200px]"
              >
                Continue to Results
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
