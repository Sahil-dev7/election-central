import { motion } from "framer-motion";
import { Check, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { PartySymbol } from "./PartySymbols";
import { useLanguage } from "@/contexts/LanguageContext";

interface CandidateCardProps {
  id: string;
  name: string;
  party: string;
  photo: string;
  manifesto?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showVoteButton?: boolean;
  voteCount?: number;
  totalVotes?: number;
}

export function CandidateCard({
  id,
  name,
  party,
  photo,
  manifesto,
  isSelected,
  onSelect,
  showVoteButton = true,
  voteCount,
  totalVotes,
}: CandidateCardProps) {
  const { language } = useLanguage();
  const percentage = totalVotes && voteCount ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border-2 transition-all duration-300 cursor-pointer",
        isSelected 
          ? "border-election-gold shadow-lg" 
          : "border-border/50 hover:border-primary/30 hover:shadow-md"
      )}
      onClick={() => onSelect?.(id)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-election-gold flex items-center justify-center shadow-md"
        >
          <Check className="w-4 h-4 text-foreground" />
        </motion.div>
      )}

      {/* Photo section - NO CROPPING, show full image */}
      <div className="relative bg-muted">
        <div className="w-full p-3">
          <img
            src={photo}
            alt={name}
            className="w-full h-auto max-h-48 object-contain mx-auto rounded-lg"
            loading="lazy"
            style={{ display: 'block' }}
          />
        </div>
        
        {/* Party symbol badge */}
        <div className="absolute bottom-2 left-3 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center overflow-hidden border-2 border-card">
          <PartySymbol party={party} className="w-7 h-7" />
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        <h3 className="text-base font-bold text-foreground mb-1 leading-tight">{name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <PartySymbol party={party} className="w-4 h-4" />
          <p className="text-xs font-medium text-primary truncate">{party}</p>
        </div>
        
        {manifesto && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {manifesto}
          </p>
        )}

        {/* Vote count bar */}
        {voteCount !== undefined && totalVotes !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {language === "hi" ? "वोट" : "Votes"}
              </span>
              <span className="font-semibold text-foreground">{voteCount.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-election-gold rounded-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{percentage}%</p>
          </div>
        )}

        {/* Vote button */}
        {showVoteButton && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2",
              isSelected
                ? "bg-election-gold text-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(id);
            }}
          >
            <Vote className="w-4 h-4" />
            {isSelected 
              ? (language === "hi" ? "चयनित ✓" : "Selected ✓")
              : (language === "hi" ? "चुनें" : "Select")
            }
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
