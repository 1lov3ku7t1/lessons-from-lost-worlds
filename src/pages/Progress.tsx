import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Target } from "lucide-react";
import { useProgress, ALL_BADGES } from "@/hooks/useProgress";
import { missions } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Progress = () => {
  const navigate = useNavigate();
  const { progress, getEarnedBadges, getProgressPercent } = useProgress();
  const earned = getEarnedBadges();
  const percent = getProgressPercent();

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
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl gradient-accent flex items-center justify-center mx-auto mb-5 shadow-glow">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">Your Progress</h1>
          <p className="text-muted-foreground text-sm">{earned.length} / {ALL_BADGES.length} badges earned</p>
        </motion.div>

        {/* Overall progress ring */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-6 mb-6 shadow-card flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${percent}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-heading font-bold text-foreground">{percent}%</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground mb-1">Overall Completion</p>
            <p className="text-xs text-muted-foreground">
              {progress.missionsRead.length}/7 missions · {Object.keys(progress.gamesCompleted).length}/7 games · {progress.quizBestScore !== null ? "Quiz ✓" : "Quiz pending"}
            </p>
          </div>
        </motion.div>

        {/* Badges grid */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            Badges
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ALL_BADGES.map((badge) => {
              const isEarned = progress.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`glass rounded-2xl border p-4 transition-all ${
                    isEarned ? "border-warning/30 shadow-[0_0_20px_hsl(38_92%_55%/0.1)]" : "border-border/20 opacity-40"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{badge.icon}</span>
                  <p className="font-heading font-semibold text-foreground text-sm">{badge.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission completion list */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Mission Progress
          </h2>
          <div className="space-y-2">
            {missions.map((m) => {
              const read = progress.missionsRead.includes(m.id);
              const gameScore = progress.gamesCompleted[m.id];
              return (
                <div key={m.id} className="glass rounded-xl border border-border/40 p-3 flex items-center gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${read ? "text-success" : "text-muted-foreground"}`}>
                        {read ? "✓ Read" : "○ Unread"}
                      </span>
                      {gameScore !== undefined && (
                        <span className="text-xs text-primary">🎮 {gameScore}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Progress;
