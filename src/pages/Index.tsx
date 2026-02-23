import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, BookOpen, HelpCircle, Info } from "lucide-react";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <StarField />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md text-center space-y-8"
      >
        <motion.div variants={fadeInUp} className="space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center shadow-glow animate-float">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-heading font-bold text-gradient">SpaceWise</h1>
          <p className="text-muted-foreground text-lg">
            Learning from space mission failures
          </p>
          <p className="text-primary text-sm font-medium">
            Every failure taught us something...
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-3 pt-4">
          <button
            onClick={() => navigate("/missions")}
            className="w-full py-4 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold text-lg shadow-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Explore Missions
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-heading font-medium transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            Take the Quiz
          </button>
        </motion.div>

        <motion.button
          variants={fadeInUp}
          onClick={() => navigate("/about")}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 mx-auto"
        >
          <Info className="w-4 h-4" />
          About
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;
