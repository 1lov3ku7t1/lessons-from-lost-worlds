import { Mission } from "@/data/missions";
import StatusBadge from "./StatusBadge";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
  index: number;
}

const MissionCard = ({ mission, onClick, index }: MissionCardProps) => {
  return (
    <motion.button
      variants={fadeInUp}
      onClick={onClick}
      className="w-full gradient-card rounded-lg border border-border/50 p-4 flex items-center gap-4 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group text-left"
    >
      <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
        {mission.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-foreground truncate">{mission.name}</h3>
        <p className="text-sm text-muted-foreground">{mission.agency} · {mission.year}</p>
      </div>
      <StatusBadge status={mission.status} />
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </motion.button>
  );
};

export default MissionCard;
