import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { quizQuestions } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

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
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  if (finished) {
    return (
      <div className="relative min-h-screen px-6 py-12">
        <StarField />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md mx-auto text-center pt-20"
        >
          <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground mb-1">
            You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-bold">{quizQuestions.length}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {score === quizQuestions.length ? "Perfect! You're a space expert! 🚀" : score >= 4 ? "Great job! You know your space history!" : "Keep learning — every failure teaches us something!"}
          </p>
          <div className="space-y-3">
            <button onClick={handleRestart} className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button onClick={() => navigate("/")} className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-heading font-medium transition-colors">
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-12">
      <StarField />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
          <span className="text-sm text-muted-foreground font-heading">
            {currentQ + 1} / {quizQuestions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full gradient-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (answered ? 1 : 0)) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
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
            <h2 className="text-xl font-heading font-semibold text-foreground mb-6">{question.question}</h2>

            <div className="space-y-3 mb-6">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left gradient-card rounded-xl border p-4 transition-all duration-300 ${
                    answered && i === question.correctIndex
                      ? "border-success/50"
                      : answered && i === selected && i !== question.correctIndex
                      ? "border-destructive/50"
                      : answered
                      ? "border-border/30 opacity-50"
                      : "border-border/50 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      answered && i === question.correctIndex
                        ? "bg-success/20 text-success"
                        : answered && i === selected
                        ? "bg-destructive/20 text-destructive"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {answered && i === question.correctIndex ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : answered && i === selected ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <p className="text-sm text-secondary-foreground">{option}</p>
                  </div>
                </button>
              ))}
            </div>

            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="gradient-card rounded-xl border border-primary/20 p-4 mb-4">
                  <p className="text-sm text-secondary-foreground">{question.explanation}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold shadow-glow hover:opacity-90 transition-opacity"
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
