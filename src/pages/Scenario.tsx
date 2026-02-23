import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle2, XCircle } from "lucide-react";
import { apolloScenario } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Scenario = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = apolloScenario.find((o) => o.id === selected);

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
            onClick={() => navigate("/missions/apollo-13")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-warning" />
            <h1 className="text-2xl font-heading font-bold text-foreground">What Would You Do?</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Apollo 13, April 1970. An oxygen tank just exploded. The Command Module is losing power. You're 320,000 km from Earth. What's your call?
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-3 mb-6">
          {apolloScenario.map((option) => (
            <motion.button
              key={option.id}
              variants={fadeInUp}
              onClick={() => setSelected(option.id)}
              disabled={!!selected}
              className={`w-full text-left gradient-card rounded-xl border p-4 transition-all duration-300 ${
                selected === option.id
                  ? option.isCorrect
                    ? "border-success/50 shadow-[0_0_20px_hsl(142_60%_45%/0.15)]"
                    : "border-destructive/50 shadow-[0_0_20px_hsl(0_72%_51%/0.15)]"
                  : selected
                  ? "border-border/30 opacity-50"
                  : "border-border/50 hover:border-primary/40 hover:shadow-glow"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-heading font-bold text-secondary-foreground shrink-0 mt-0.5">
                  {option.id.toUpperCase()}
                </span>
                <p className="text-sm text-secondary-foreground">{option.text}</p>
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
              <div className={`gradient-card rounded-xl border p-5 ${selectedOption.isCorrect ? "border-success/30" : "border-destructive/30"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedOption.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <h3 className="font-heading font-semibold text-foreground">
                    {selectedOption.isCorrect ? "Correct!" : "Not quite."}
                  </h3>
                </div>
                <p className="text-sm text-secondary-foreground mb-3">{selectedOption.outcome}</p>
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm text-primary font-medium">💡 {selectedOption.lesson}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-heading font-medium transition-colors"
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
