import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, BookOpen, HelpCircle, Info, Sparkles, Trophy, BarChart3, GraduationCap } from "lucide-react";
import StarField from "@/components/StarField";
import { useProgress } from "@/hooks/useProgress";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Index = () => {
  const navigate = useNavigate();
  const { getProgressPercent, getEarnedBadges } = useProgress();
  const percent = getProgressPercent();
  const badges = getEarnedBadges();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      <StarField />

      {/* Orbital ring decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full border border-primary/5 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-accent/5 animate-[spin_45s_linear_infinite_reverse]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-sm text-center space-y-8"
      >
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center shadow-glow animate-float">
                <Rocket className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full gradient-accent flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-heading font-bold text-gradient tracking-tight">SpaceWise</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-[280px] mx-auto">
            Compact lessons from space mission failures & successes
          </p>
        </motion.div>

        {/* Progress mini-bar */}
        {percent > 0 && (
          <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-3 flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3.5" strokeDasharray={`${percent}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-heading font-bold text-foreground">{percent}%</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-foreground">{badges.length} badges earned</p>
              <p className="text-[11px] text-muted-foreground">Keep exploring!</p>
            </div>
            <button onClick={() => navigate("/progress")} className="text-xs text-primary font-medium hover:underline">View</button>
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="space-y-3">
          <button
            onClick={() => navigate("/missions")}
            className="w-full py-4 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold text-base shadow-glow hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_60px_hsl(215_100%_55%/0.2)] flex items-center justify-center gap-2.5"
          >
            <BookOpen className="w-5 h-5" />
            Explore Missions
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-3.5 rounded-2xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <HelpCircle className="w-5 h-5" />
            Take the Quiz
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/progress")}
              className="py-3 rounded-2xl glass border border-border/40 hover:border-warning/30 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-sm">Progress</span>
            </button>
            <button
              onClick={() => navigate("/stats")}
              className="py-3 rounded-2xl glass border border-border/40 hover:border-primary/30 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm">Statistics</span>
            </button>
          </div>

          <button
            onClick={() => navigate("/teacher")}
            className="w-full py-3.5 rounded-2xl glass border border-accent/30 hover:border-accent/60 text-secondary-foreground hover:text-foreground font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <GraduationCap className="w-5 h-5 text-accent" />
            Teacher Mode
          </button>
        </motion.div>

        <motion.button
          variants={fadeInUp}
          onClick={() => navigate("/about")}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1.5 mx-auto"
        >
          <Info className="w-3.5 h-3.5" />
          About SpaceWise
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Index;
