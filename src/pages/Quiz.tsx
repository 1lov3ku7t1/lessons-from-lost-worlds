import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Brain } from "lucide-react";
import { quizQuestions } from "@/data/missions";
import { useProgress } from "@/hooks/useProgress";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { recordQuizScore } = useProgress();

  const question = quizQuestions[currentQ];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      recordQuizScore(Math.round(((score + (selected === quizQuestions[currentQ].correctIndex ? 1 : 0)) / quizQuestions.length) * 100));
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const percentage = Math.round((score / quizQuestions.length) * 100);

  if (finished) {
    return (
      <div className="relative min-h-screen px-6 py-10">
        <StarField />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-sm mx-auto text-center pt-16"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center shadow-glow">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">Quiz Complete!</h1>
          <div className="glass rounded-2xl border border-border/40 p-6 mb-6 mt-6">
            <p className="text-4xl font-heading font-bold text-foreground mb-1">{percentage}%</p>
            <p className="text-muted-foreground text-sm">
              <span className="text-primary font-semibold">{score}</span> out of {quizQuestions.length} correct
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              {score === quizQuestions.length
                ? "Perfect! You're a space expert! 🚀"
                : score >= 4
                ? "Great job! You know your space history!"
                : "Keep learning — every failure teaches us something!"}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full py-4 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-2xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground font-heading font-medium transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-10">
      <StarField />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-heading font-medium">
              {currentQ + 1} / {quizQuestions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full gradient-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (answered ? 1 : 0)) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-heading font-semibold text-foreground mb-6 leading-relaxed">{question.question}</h2>

            <div className="space-y-3 mb-6">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left glass rounded-2xl border p-4 transition-all duration-300 ${
                    answered && i === question.correctIndex
                      ? "border-success/40 shadow-[0_0_20px_hsl(152_60%_46%/0.1)]"
                      : answered && i === selected && i !== question.correctIndex
                      ? "border-destructive/40 shadow-[0_0_20px_hsl(0_72%_55%/0.1)]"
                      : answered
                      ? "border-border/20 opacity-40"
                      : "border-border/40 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      answered && i === question.correctIndex
                        ? "bg-success/15 text-success"
                        : answered && i === selected
                        ? "bg-destructive/15 text-destructive"
                        : "bg-secondary/80 text-secondary-foreground"
                    }`}>
                      {answered && i === question.correctIndex ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : answered && i === selected ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <p className="text-sm text-secondary-foreground leading-relaxed">{option}</p>
                  </div>
                </button>
              ))}
            </div>

            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass rounded-2xl border border-primary/15 p-4 mb-4">
                  <p className="text-sm text-secondary-foreground leading-relaxed">{question.explanation}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-all"
                >
                  {currentQ < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
