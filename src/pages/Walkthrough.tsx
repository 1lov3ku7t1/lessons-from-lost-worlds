import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2,
  XCircle, BookOpen, ArrowRight
} from "lucide-react";
import { missions } from "@/data/missions";
import { walkthroughs } from "@/data/walkthroughSteps";
import { useProgress } from "@/hooks/useProgress";
import StarField from "@/components/StarField";
import { fadeInUp } from "@/lib/animations";

const Walkthrough = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);
  const walkthrough = walkthroughs.find((w) => w.missionId === id);
  const { markMissionRead } = useProgress();

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (id) markMissionRead(id);
  }, [id]);

  if (!mission || !walkthrough) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Walkthrough not found.</p>
      </div>
    );
  }

  const step = walkthrough.steps[stepIndex];
  const totalSteps = walkthrough.steps.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const canAdvance = !step.checkpoint || answered;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
  };

  const nextStep = () => {
    if (isLastStep) {
      navigate(`/missions/${id}`);
      return;
    }
    setStepIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen px-6 py-10"
    >
      <StarField />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/missions")}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{mission.icon}</span>
              <h1 className="font-heading font-bold text-foreground text-lg">{mission.name}</h1>
            </div>
            <p className="text-[11px] text-muted-foreground">Guided Walkthrough</p>
          </div>
          <div className="text-xs text-muted-foreground font-heading">
            {stepIndex + 1} / {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-muted mb-6 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="glass rounded-2xl border border-border/40 p-6 shadow-card mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-semibold text-foreground text-base">{step.title}</h2>
              </div>
              <p className="text-secondary-foreground text-sm leading-relaxed">{step.content}</p>
            </div>

            {/* Checkpoint question */}
            {step.checkpoint && (
              <div className="glass rounded-2xl border border-primary/20 p-5 shadow-card ring-glow mb-4">
                <h3 className="font-heading font-semibold text-foreground text-sm mb-3">
                  ✋ Checkpoint
                </h3>
                <p className="text-secondary-foreground text-sm mb-4">{step.checkpoint.question}</p>

                <div className="space-y-2">
                  {step.checkpoint.options.map((opt, i) => {
                    let borderClass = "border-border/40 hover:border-primary/30";
                    let bgClass = "";

                    if (answered) {
                      if (i === step.checkpoint!.correctIndex) {
                        borderClass = "border-success/50";
                        bgClass = "bg-success/10";
                      } else if (i === selectedAnswer) {
                        borderClass = "border-destructive/50";
                        bgClass = "bg-destructive/10";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className={`w-full text-left p-3 rounded-xl glass border ${borderClass} ${bgClass} text-sm text-secondary-foreground transition-all flex items-center gap-3 ${!answered ? "cursor-pointer" : ""}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-xs font-heading font-bold text-muted-foreground shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {answered && i === step.checkpoint!.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        )}
                        {answered && i === selectedAnswer && i !== step.checkpoint!.correctIndex && (
                          <XCircle className="w-4 h-4 text-destructive shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-3 p-3 rounded-xl text-sm leading-relaxed ${selectedAnswer === step.checkpoint!.correctIndex ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"}`}>
                        {step.checkpoint!.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={prevStep}
            disabled={stepIndex === 0}
            className="py-3 px-5 rounded-2xl glass border border-border/40 text-secondary-foreground font-heading font-medium transition-all flex items-center gap-2 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={nextStep}
            disabled={!canAdvance}
            className={`flex-1 py-3 rounded-2xl font-heading font-semibold transition-all flex items-center justify-center gap-2 ${canAdvance
              ? isLastStep
                ? "gradient-accent text-primary-foreground shadow-glow"
                : "glass border border-primary/30 hover:border-primary/60 text-foreground"
              : "glass border border-border/40 text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
          >
            {isLastStep ? (
              <>
                View Full Mission <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Walkthrough;
