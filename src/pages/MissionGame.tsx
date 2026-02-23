import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, RotateCcw, Gamepad2, CheckCircle2, XCircle, GripVertical } from "lucide-react";
import { getGameForMission, type MissionGame, type OrderEventsGame, type TrueFalseGame, type FillBlankGame, type MatchingGame } from "@/data/games";
import { missions } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

/* ── Order Events ── */
const OrderEventsChallenge = ({ game, onComplete }: { game: OrderEventsGame; onComplete: (score: number) => void }) => {
  const shuffled = useMemo(() => [...game.events].sort(() => Math.random() - 0.5), [game.events]);
  const [items, setItems] = useState(shuffled);
  const [submitted, setSubmitted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const swap = (i: number, j: number) => {
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSubmit = () => {
    const correct = items.filter((item, i) => item === game.events[i]).length;
    setSubmitted(true);
    onComplete(Math.round((correct / game.events.length) * 100));
  };

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm mb-4">Tap arrows to reorder, then submit.</p>
      {items.map((event, i) => {
        const isCorrect = submitted && event === game.events[i];
        const isWrong = submitted && event !== game.events[i];
        return (
          <motion.div
            key={event}
            layout
            className={`glass rounded-xl border p-3 flex items-center gap-3 text-sm transition-colors ${
              isCorrect ? "border-success/50 bg-success/5" : isWrong ? "border-destructive/50 bg-destructive/5" : "border-border/40"
            }`}
          >
            <span className="w-6 h-6 rounded-lg glass-subtle flex items-center justify-center text-xs font-heading font-bold text-muted-foreground shrink-0">
              {i + 1}
            </span>
            <span className="flex-1 text-secondary-foreground">{event}</span>
            {!submitted && (
              <div className="flex flex-col gap-0.5 shrink-0">
                <button disabled={i === 0} onClick={() => swap(i, i - 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
                <button disabled={i === items.length - 1} onClick={() => swap(i, i + 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
              </div>
            )}
            {submitted && (isCorrect ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />)}
          </motion.div>
        );
      })}
      {!submitted && (
        <button onClick={handleSubmit} className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold mt-4">
          Check Order
        </button>
      )}
    </div>
  );
};

/* ── True/False ── */
const TrueFalseChallenge = ({ game, onComplete }: { game: TrueFalseGame; onComplete: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(game.statements.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = game.statements[currentIdx];

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = answer;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentIdx < game.statements.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const correct = answers.filter((a, i) => a === game.statements[i].isTrue).length;
      setFinished(true);
      onComplete(Math.round((correct / game.statements.length) * 100));
    }
  };

  if (finished) return null;

  const isCorrect = answers[currentIdx] === current.isTrue;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Statement {currentIdx + 1} / {game.statements.length}</span>
        <div className="h-1.5 flex-1 mx-4 rounded-full bg-border/30 overflow-hidden">
          <div className="h-full gradient-accent rounded-full transition-all" style={{ width: `${((currentIdx + 1) / game.statements.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-2xl border border-border/40 p-5">
          <p className="text-foreground text-sm font-medium leading-relaxed mb-5">"{current.text}"</p>

          {!showResult ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAnswer(true)} className="py-3 rounded-xl glass border border-success/20 hover:border-success/50 text-success font-heading font-semibold transition-all">True</button>
              <button onClick={() => handleAnswer(false)} className="py-3 rounded-xl glass border border-destructive/20 hover:border-destructive/50 text-destructive font-heading font-semibold transition-all">False</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 text-sm font-medium ${isCorrect ? "text-success" : "text-destructive"}`}>
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isCorrect ? "Correct!" : "Not quite!"}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{current.explanation}</p>
              <button onClick={handleNext} className="w-full py-2.5 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold text-sm">
                {currentIdx < game.statements.length - 1 ? "Next" : "See Results"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── Fill in Blank ── */
const FillBlankChallenge = ({ game, onComplete }: { game: FillBlankGame; onComplete: (score: number) => void }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(game.sentences.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number, value: string) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
  };

  const handleSubmit = () => {
    const correct = answers.filter((a, i) => a === game.sentences[i].blank).length;
    setSubmitted(true);
    onComplete(Math.round((correct / game.sentences.length) * 100));
  };

  return (
    <div className="space-y-4">
      {game.sentences.map((s, i) => {
        const isCorrect = submitted && answers[i] === s.blank;
        const isWrong = submitted && answers[i] !== s.blank && answers[i] !== "";
        return (
          <div key={i} className={`glass rounded-xl border p-4 transition-colors ${isCorrect ? "border-success/50" : isWrong ? "border-destructive/50" : "border-border/40"}`}>
            <p className="text-secondary-foreground text-sm mb-3">
              {s.text.replace("___", answers[i] ? `[${answers[i]}]` : "___")}
            </p>
            <div className="flex flex-wrap gap-2">
              {s.options.map((opt) => (
                <button
                  key={opt}
                  disabled={submitted}
                  onClick={() => handleSelect(i, opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    answers[i] === opt
                      ? submitted
                        ? opt === s.blank ? "gradient-accent text-primary-foreground" : "bg-destructive/20 text-destructive"
                        : "gradient-accent text-primary-foreground"
                      : "glass-subtle border border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {submitted && isWrong && <p className="text-xs text-success mt-2">Correct: {s.blank}</p>}
          </div>
        );
      })}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answers.some((a) => a === "")}
          className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold disabled:opacity-40 mt-2"
        >
          Check Answers
        </button>
      )}
    </div>
  );
};

/* ── Matching ── */
const MatchingChallenge = ({ game, onComplete }: { game: MatchingGame; onComplete: (score: number) => void }) => {
  const shuffledRight = useMemo(() => [...game.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5), [game.pairs]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRightClick = (right: string) => {
    if (activeLeft === null || submitted) return;
    setSelected((prev) => ({ ...prev, [activeLeft]: right }));
    setActiveLeft(null);
  };

  const handleSubmit = () => {
    const correct = game.pairs.filter((p, i) => selected[i] === p.right).length;
    setSubmitted(true);
    onComplete(Math.round((correct / game.pairs.length) * 100));
  };

  const usedRights = Object.values(selected);

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm mb-3">Tap a left item, then tap its match on the right.</p>
      {game.pairs.map((pair, i) => {
        const isCorrect = submitted && selected[i] === pair.right;
        const isWrong = submitted && selected[i] !== pair.right && selected[i] !== undefined;
        return (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => !submitted && setActiveLeft(i)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs text-left transition-all ${
                activeLeft === i ? "glass border-primary/50 border text-foreground" : "glass border border-border/40 text-secondary-foreground"
              } ${isCorrect ? "border-success/50" : isWrong ? "border-destructive/50" : ""}`}
            >
              {pair.left}
            </button>
            <span className="text-muted-foreground text-xs">→</span>
            <div className={`flex-1 py-2.5 px-3 rounded-xl text-xs glass border transition-all min-h-[38px] ${
              selected[i] ? (isCorrect ? "border-success/50 text-foreground" : isWrong ? "border-destructive/50 text-foreground" : "border-primary/30 text-foreground") : "border-border/30 text-muted-foreground"
            }`}>
              {selected[i] || "—"}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <>
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/20">
            {shuffledRight.map((right) => {
              const isUsed = usedRights.includes(right);
              return (
                <button
                  key={right}
                  disabled={isUsed}
                  onClick={() => handleRightClick(right)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isUsed ? "opacity-30 cursor-not-allowed glass-subtle" : "glass-subtle border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {right}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length < game.pairs.length}
            className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold disabled:opacity-40 mt-2"
          >
            Check Matches
          </button>
        </>
      )}
      {submitted && game.pairs.some((p, i) => selected[i] !== p.right) && (
        <div className="mt-3 glass rounded-xl border border-border/40 p-3">
          <p className="text-xs text-muted-foreground font-medium mb-1">Correct matches:</p>
          {game.pairs.map((p, i) => selected[i] !== p.right && (
            <p key={i} className="text-xs text-success">{p.left} → {p.right}</p>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Page ── */
const MissionGame = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const game = getGameForMission(id || "");
  const mission = missions.find((m) => m.id === id);
  const [score, setScore] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  if (!game || !mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No game found for this mission.</p>
      </div>
    );
  }

  const handleComplete = (s: number) => setScore(s);
  const handleRetry = () => { setScore(null); setKey((k) => k + 1); };

  const gameTypeLabel = game.type === "order-events" ? "🔢 Order Events"
    : game.type === "true-false" ? "✅ True or False"
    : game.type === "fill-blank" ? "✏️ Fill the Blank"
    : "🔗 Match Up";

  return (
    <div className="relative min-h-screen px-6 py-10">
      <StarField />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 w-full max-w-lg mx-auto">
        <motion.div variants={fadeInUp}>
          <button onClick={() => navigate(`/missions/${id}`)} className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6">
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-1">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-heading font-bold text-foreground">{game.title}</h1>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground">{mission.icon} {mission.name}</span>
          <span className="text-xs glass-subtle px-2 py-0.5 rounded-md text-muted-foreground">{gameTypeLabel}</span>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-4">
          <p className="text-secondary-foreground text-sm">{game.instruction}</p>
        </motion.div>

        <motion.div variants={fadeInUp} key={key}>
          {game.type === "order-events" && <OrderEventsChallenge game={game} onComplete={handleComplete} />}
          {game.type === "true-false" && <TrueFalseChallenge game={game} onComplete={handleComplete} />}
          {game.type === "fill-blank" && <FillBlankChallenge game={game} onComplete={handleComplete} />}
          {game.type === "matching" && <MatchingChallenge game={game} onComplete={handleComplete} />}
        </motion.div>

        {/* Score card */}
        <AnimatePresence>
          {score !== null && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass rounded-2xl border border-primary/20 p-6 text-center shadow-glow">
              <Trophy className={`w-10 h-10 mx-auto mb-3 ${score >= 80 ? "text-warning" : score >= 50 ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-3xl font-heading font-bold text-foreground">{score}%</p>
              <p className="text-muted-foreground text-sm mt-1">
                {score === 100 ? "Perfect! 🎉" : score >= 80 ? "Great job!" : score >= 50 ? "Good effort!" : "Keep learning!"}
              </p>
              <div className="flex gap-3 mt-5">
                <button onClick={handleRetry} className="flex-1 py-2.5 rounded-xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 transition-all">
                  <RotateCcw className="w-3.5 h-3.5" /> Retry
                </button>
                <button onClick={() => navigate(`/missions/${id}`)} className="flex-1 py-2.5 rounded-xl gradient-accent text-primary-foreground text-sm font-heading font-semibold">
                  Back to Mission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MissionGame;
