import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { missions } from "@/data/missions";
import MissionCard from "@/components/MissionCard";
import StarField from "@/components/StarField";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const Missions = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen px-6 py-12">
      <StarField />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
          <h1 className="text-3xl font-heading font-bold text-foreground">Missions</h1>
          <p className="text-muted-foreground mt-1">Browse real space mission cases</p>
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
    </div>
  );
};

export default Missions;
