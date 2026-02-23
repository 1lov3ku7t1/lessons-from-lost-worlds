import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Quote, Zap, Calendar, Building2, Layers, Gamepad2 } from "lucide-react";
import { missions } from "@/data/missions";
import { getGameForMission } from "@/data/games";
import StatusBadge from "@/components/StatusBadge";
import ListenButton from "@/components/ListenButton";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const MissionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);
  const hasGame = !!getGameForMission(id || "");

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Mission not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-10">
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
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        {/* Hero header */}
        <motion.div variants={fadeInUp} className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl glass border border-border/40 flex items-center justify-center text-3xl shrink-0">
            {mission.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">{mission.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{mission.agency}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{mission.year}</span>
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{mission.phase}</span>
            </div>
            <div className="mt-2.5"><StatusBadge status={mission.status} /></div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-5">
          <ListenButton text={`${mission.name}. ${mission.detailText}. Lesson learned: ${mission.lessonLearned}`} />
        </motion.div>

        {/* What Happened */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 mb-4 shadow-card">
          <h2 className="font-heading font-semibold text-foreground text-sm mb-2.5">What Happened</h2>
          <p className="text-secondary-foreground text-sm leading-relaxed">{mission.detailText}</p>
        </motion.div>

        {/* Lesson Learned */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-primary/20 p-5 mb-4 shadow-card ring-glow">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <h2 className="font-heading font-semibold text-foreground text-sm">Lesson Learned</h2>
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed">{mission.lessonLearned}</p>
        </motion.div>

        {/* Key Fact */}
        {mission.keyFact && (
          <motion.div variants={fadeInUp} className="glass rounded-2xl border border-warning/15 p-5 mb-4 shadow-card">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
                <Quote className="w-3.5 h-3.5 text-warning" />
              </div>
              <h2 className="font-heading font-semibold text-foreground text-sm">Key Fact</h2>
            </div>
            <p className="text-secondary-foreground text-sm leading-relaxed italic">{mission.keyFact}</p>
          </motion.div>
        )}

        {/* Mini-game CTA */}
        {hasGame && (
          <motion.div variants={fadeInUp} className="mt-4">
            <button
              onClick={() => navigate(`/missions/${id}/game`)}
              className="w-full py-3.5 rounded-2xl glass border border-accent/30 hover:border-accent/60 text-foreground font-heading font-semibold transition-all duration-300 flex items-center justify-center gap-2.5"
            >
              <Gamepad2 className="w-5 h-5 text-accent" />
              Play Mini-Game
            </button>
          </motion.div>
        )}

        {/* Scenario CTA */}
        {mission.id === "apollo-13" && (
          <motion.div variants={fadeInUp} className="mt-3">
            <button
              onClick={() => navigate("/scenario")}
              className="w-full py-4 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_60px_hsl(215_100%_55%/0.2)] flex items-center justify-center gap-2.5"
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
