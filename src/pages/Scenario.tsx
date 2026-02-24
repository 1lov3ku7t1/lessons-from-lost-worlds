import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { missions } from "@/data/missions";
import { missionScenarios } from "@/data/scenarios";
import { useProgress } from "@/hooks/useProgress";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Scenario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const missionId = id || "apollo-13";
  const scenario = missionScenarios.find((s) => s.missionId === missionId);
  const mission = missions.find((m) => m.id === missionId);
  const [selected, setSelected] = useState<string | null>(null);
  const { markScenarioComplete } = useProgress();

  if (!scenario || !mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Scenario not found.</p>
      </div>
    );
  }

  const selectedOption = scenario.options.find((o) => o.id === selected);

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
            onClick={() => navigate(`/missions/${missionId}`)}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">What Would You Do?</h1>
              <p className="text-xs text-muted-foreground">{mission.name} — {mission.year}</p>
            </div>
          </div>
          <div className="glass rounded-2xl border border-warning/15 p-4">
            <p className="text-secondary-foreground text-sm leading-relaxed">
              <span className="text-warning font-semibold">{mission.name}, {mission.year}.</span>{" "}
              {scenario.situation}
            </p>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-3 mb-6">
          {scenario.options.map((option) => (
            <motion.button
              key={option.id}
              variants={fadeInUp}
              onClick={() => { setSelected(option.id); markScenarioComplete(); }}
              disabled={!!selected}
              className={`w-full text-left glass rounded-2xl border p-4 transition-all duration-300 ${
                selected === option.id
                  ? option.isCorrect
                    ? "border-success/40 shadow-[0_0_24px_hsl(152_60%_46%/0.12)]"
                    : "border-destructive/40 shadow-[0_0_24px_hsl(0_72%_55%/0.12)]"
                  : selected
                  ? "border-border/20 opacity-40"
                  : "border-border/40 hover:border-primary/30 hover:shadow-glow"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                  selected === option.id
                    ? option.isCorrect ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    : "bg-secondary/80 text-secondary-foreground"
                }`}>
                  {option.id.toUpperCase()}
                </span>
                <p className="text-sm text-secondary-foreground leading-relaxed pt-1">{option.text}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className={`glass rounded-2xl border p-5 ${selectedOption.isCorrect ? "border-success/30" : "border-destructive/30"}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  {selectedOption.isCorrect ? (
                    <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-destructive" />
                    </div>
                  )}
                  <h3 className="font-heading font-semibold text-foreground">
                    {selectedOption.isCorrect ? "Correct!" : "Not quite."}
                  </h3>
                </div>
                <p className="text-sm text-secondary-foreground leading-relaxed mb-4">{selectedOption.outcome}</p>
                <div className="rounded-xl bg-primary/8 border border-primary/15 p-3.5">
                  <p className="text-sm text-primary font-medium leading-relaxed">💡 {selectedOption.lesson}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full py-3.5 rounded-2xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Scenario;
