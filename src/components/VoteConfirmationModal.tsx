import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Vote, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateName: string;
  candidateParty: string;
  candidatePhoto: string;
  isSubmitting?: boolean;
}

export function VoteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  candidateParty,
  candidatePhoto,
  isSubmitting,
}: VoteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="gradient-hero p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-election-gold/20 flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-election-gold" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Confirm Your Vote</h2>
              <p className="text-white/80 mt-2 text-sm">
                This action cannot be undone. Please verify your selection.
              </p>
            </div>

            {/* Candidate preview */}
            <div className="p-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <img
                  src={candidatePhoto}
                  alt={candidateName}
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg text-foreground">{candidateName}</h3>
                  <p className="text-sm text-election-blue font-medium">{candidateParty}</p>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 flex items-center gap-2">
                  <Vote className="w-4 h-4 flex-shrink-0" />
                  <span>You can only vote once per election. Make sure this is your final choice.</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Go Back
                </Button>
                <Button
                  variant="vote"
                  className="flex-1"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                    />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Vote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
