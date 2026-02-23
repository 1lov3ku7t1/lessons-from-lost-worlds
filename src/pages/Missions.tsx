import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Satellite } from "lucide-react";
import { missions } from "@/data/missions";
import MissionCard from "@/components/MissionCard";
import StarField from "@/components/StarField";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const Missions = () => {
  const navigate = useNavigate();

  const successCount = missions.filter((m) => m.status === "Success").length;
  const failureCount = missions.filter((m) => m.status === "Failure").length;
  const partialCount = missions.filter((m) => m.status === "Partial").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="relative min-h-screen px-6 py-10">
      <StarField />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-5"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Mission Explorer</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-4">Browse real space mission cases and their lessons</p>

          {/* Stats bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success" />
              {successCount} Success
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {partialCount} Partial
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              {failureCount} Failure
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {missions.map((mission, index) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              index={index}
              onClick={() => navigate(`/missions/${mission.id}`)}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Missions;
