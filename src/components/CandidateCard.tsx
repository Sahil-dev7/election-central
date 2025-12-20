import { motion } from "framer-motion";
import { Check, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  id: string;
  name: string;
  party: string;
  partySymbol?: string;
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
  partySymbol,
  photo,
  manifesto,
  isSelected,
  onSelect,
  showVoteButton = true,
  voteCount,
  totalVotes,
}: CandidateCardProps) {
  const percentage = totalVotes && voteCount ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "candidate-card group cursor-pointer",
        isSelected && "selected"
      )}
      onClick={() => onSelect?.(id)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-election-gold flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-foreground" />
        </motion.div>
      )}

      {/* Photo section */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-b from-election-navy to-election-blue">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Party symbol */}
        {partySymbol && (
          <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <img src={partySymbol} alt={party} className="w-10 h-10 object-contain" />
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm font-medium text-election-blue mb-3">{party}</p>
        
        {manifesto && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {manifesto}
          </p>
        )}

        {/* Vote count bar */}
        {voteCount !== undefined && totalVotes !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Votes</span>
              <span className="font-semibold text-foreground">{voteCount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-election-blue to-election-gold rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">{percentage}%</p>
          </div>
        )}

        {/* Vote button */}
        {showVoteButton && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
              isSelected
                ? "bg-election-gold text-foreground shadow-lg"
                : "bg-secondary text-secondary-foreground hover:bg-election-blue hover:text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(id);
            }}
          >
            <Vote className="w-5 h-5" />
            {isSelected ? "Selected" : "Select Candidate"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
