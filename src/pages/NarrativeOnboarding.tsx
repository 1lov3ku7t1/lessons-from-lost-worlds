import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ChevronRight } from "lucide-react";
import { narrativeSteps } from "@/data/onboardingNarrative";
import StarField from "@/components/StarField";
import { fadeInUp } from "@/lib/animations";

const NarrativeOnboarding = () => {
  const navigate = useNavigate();
  const [stepId, setStepId] = useState(0);
  const step = narrativeSteps.find((s) => s.id === stepId);

  if (!step) return null;

  const isLast = !step.choices && stepId === 3;

  const emotionBorder: Record<string, string> = {
    neutral: "border-border/40",
    urgent: "border-destructive/40",
    encouraging: "border-success/40",
    dramatic: "border-warning/40",
  };

  const handleContinue = () => {
    if (isLast) {
      localStorage.setItem("spacewise-onboarded", "true");
      navigate("/missions");
    } else if (!step.choices) {
      setStepId(stepId + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      <StarField />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Avatar */}
        <motion.div {...fadeInUp} className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center shadow-glow">
            <Rocket className="w-10 h-10 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Dialog */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`glass rounded-2xl border ${emotionBorder[step.emotion]} p-5 shadow-card`}
          >
            <p className="text-[11px] font-heading font-bold text-primary uppercase tracking-wider mb-2">
              {step.speaker}
            </p>
            <p className="text-secondary-foreground text-sm leading-relaxed">{step.text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Choices or Continue */}
        {step.choices ? (
          <div className="space-y-2.5">
            {step.choices.map((choice) => (
              <button
                key={choice.next}
                onClick={() => setStepId(choice.next)}
                className="w-full py-3.5 rounded-2xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                {choice.label}
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            {isLast ? "Begin Training" : "Continue"}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Skip */}
        <button
          onClick={() => { localStorage.setItem("spacewise-onboarded", "true"); navigate("/"); }}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip intro
        </button>

        {/* Step indicator */}
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i <= stepId ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NarrativeOnboarding;
