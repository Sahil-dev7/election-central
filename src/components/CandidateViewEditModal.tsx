import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  MapPin,
  FileText,
  Edit,
  Save,
  X,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  nameHi?: string;
  party: string;
  partyHi?: string;
  photo: string;
  manifesto: string;
  manifestoHi?: string;
  constituency?: string;
  constituencyHi?: string;
  status: "approved" | "pending" | "rejected";
  voteCount: number;
}

interface CandidateViewEditModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit";
  onSave?: (candidate: Candidate) => void;
}

export function CandidateViewEditModal({
  candidate,
  isOpen,
  onClose,
  mode,
  onSave,
}: CandidateViewEditModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editData, setEditData] = useState<Candidate | null>(candidate);

  // Update editData when candidate changes
  useState(() => {
    setEditData(candidate);
    setIsEditing(mode === "edit");
  });

  if (!candidate) return null;

  const handleSave = () => {
    if (!editData) return;
    
    if (!editData.name || !editData.party) {
      toast({
        title: "Missing Fields",
        description: "Name and Party are required fields.",
        variant: "destructive",
      });
      return;
    }

    onSave?.(editData);
    toast({
      title: "Candidate Updated",
      description: `${editData.name}'s profile has been updated successfully.`,
    });
    setIsEditing(false);
    onClose();
  };

  const statusColors = {
    approved: "bg-success/10 text-success border-success/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="w-5 h-5 text-primary" />
                Edit Candidate
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-primary" />
                Candidate Profile
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update candidate information and manifesto."
              : "View detailed candidate profile and statistics."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Profile header */}
          <div className="flex items-start gap-6 mb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={editData?.photo || candidate.photo}
                alt={editData?.name || candidate.name}
                className="w-24 h-24 rounded-xl object-cover ring-4 ring-background shadow-lg"
              />
              <Badge
                className={`absolute -bottom-2 -right-2 ${statusColors[editData?.status || candidate.status]}`}
              >
                {editData?.status || candidate.status}
              </Badge>
            </motion.div>

            <div className="flex-1 space-y-2">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Name (English)</Label>
                      <Input
                        value={editData?.name || ""}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev
                          )
                        }
                        placeholder="Candidate name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Name (Hindi)</Label>
                      <Input
                        value={editData?.nameHi || ""}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, nameHi: e.target.value } : prev
                          )
                        }
                        placeholder="उम्मीदवार का नाम"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Party (English)</Label>
                      <Input
                        value={editData?.party || ""}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, party: e.target.value } : prev
                          )
                        }
                        placeholder="Party name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Party (Hindi)</Label>
                      <Input
                        value={editData?.partyHi || ""}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, partyHi: e.target.value } : prev
                          )
                        }
                        placeholder="पार्टी का नाम"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-foreground">
                    {candidate.name}
                  </h3>
                  {candidate.nameHi && (
                    <p className="text-sm text-muted-foreground">
                      {candidate.nameHi}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{candidate.party}</span>
                  </div>
                  {candidate.constituency && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {candidate.constituency}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          {!isEditing && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-election-gold/10 border border-election-gold/20 text-center">
                <Vote className="w-5 h-5 mx-auto mb-1 text-election-gold" />
                <p className="text-2xl font-bold text-foreground">
                  {candidate.voteCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Votes</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {candidate.constituency || "General"}
                </p>
                <p className="text-xs text-muted-foreground">Constituency</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary text-center">
                <p className="text-2xl font-bold text-foreground capitalize">
                  {candidate.status}
                </p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          )}

          {/* Manifesto */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Manifesto
            </Label>
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editData?.manifesto || ""}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, manifesto: e.target.value } : prev
                    )
                  }
                  placeholder="Candidate's policies and vision..."
                  rows={4}
                />
                <Textarea
                  value={editData?.manifestoHi || ""}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, manifestoHi: e.target.value } : prev
                    )
                  }
                  placeholder="उम्मीदवार की नीतियां और दृष्टिकोण..."
                  rows={3}
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-foreground leading-relaxed">
                  {candidate.manifesto || "No manifesto provided."}
                </p>
                {candidate.manifestoHi && (
                  <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                    {candidate.manifestoHi}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Constituency for edit mode */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <Label className="text-xs">Constituency (English)</Label>
                <Input
                  value={editData?.constituency || ""}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, constituency: e.target.value } : prev
                    )
                  }
                  placeholder="e.g., Delhi North"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Constituency (Hindi)</Label>
                <Input
                  value={editData?.constituencyHi || ""}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, constituencyHi: e.target.value } : prev
                    )
                  }
                  placeholder="e.g., उत्तर दिल्ली"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
