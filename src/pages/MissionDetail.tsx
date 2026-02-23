import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Quote, Zap } from "lucide-react";
import { missions } from "@/data/missions";
import StatusBadge from "@/components/StatusBadge";
import ListenButton from "@/components/ListenButton";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const MissionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Mission not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-12">
      <StarField />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <motion.div variants={fadeInUp}>
          <button
            onClick={() => navigate("/missions")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl shrink-0">
            {mission.icon}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{mission.name}</h1>
            <p className="text-muted-foreground">{mission.agency} · {mission.year} · {mission.phase}</p>
            <div className="mt-2"><StatusBadge status={mission.status} /></div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-4">
          <ListenButton text={`${mission.name}. ${mission.detailText}. Lesson learned: ${mission.lessonLearned}`} />
        </motion.div>

        <motion.div variants={fadeInUp} className="gradient-card rounded-xl border border-border/50 p-5 mb-4 shadow-card">
          <h2 className="font-heading font-semibold text-foreground mb-2">What Happened</h2>
          <p className="text-secondary-foreground text-sm leading-relaxed">{mission.detailText}</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="gradient-card rounded-xl border border-primary/30 p-5 mb-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h2 className="font-heading font-semibold text-foreground">Lesson Learned</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed">{mission.lessonLearned}</p>
        </motion.div>

        {mission.keyFact && (
          <motion.div variants={fadeInUp} className="gradient-card rounded-xl border border-border/50 p-5 mb-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-4 h-4 text-warning" />
              <h2 className="font-heading font-semibold text-foreground">Key Fact</h2>
            </div>
            <p className="text-secondary-foreground text-sm leading-relaxed italic">{mission.keyFact}</p>
          </motion.div>
        )}

        {mission.id === "apollo-13" && (
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => navigate("/scenario")}
              className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
            >
              <Zap className="w-5 h-5" />
              What Would You Do?
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MissionDetail;
