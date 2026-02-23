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
      className="w-full glass rounded-2xl border border-border/40 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-glow group text-left"
    >
      <img
        src={mission.image}
        alt={`${mission.name} mission`}
        className="w-full h-32 object-cover"
        loading="lazy"
      />
      <div className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
          {mission.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground text-[15px] truncate">{mission.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{mission.agency} · {mission.year} · {mission.phase}</p>
        </div>
        <StatusBadge status={mission.status} />
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </motion.button>
  );
};

export default MissionCard;
