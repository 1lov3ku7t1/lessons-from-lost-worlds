import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, BookOpen, HelpCircle, Info, Sparkles } from "lucide-react";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
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
        className="relative z-10 w-full max-w-sm text-center space-y-10"
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
    </div>
  );
};

export default Index;
