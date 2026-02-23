import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Heart } from "lucide-react";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const About = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gradient">SpaceWise</h1>
        </motion.div>

        <motion.div variants={fadeInUp} className="gradient-card rounded-xl border border-border/50 p-5 mb-4 shadow-card space-y-3">
          <p className="text-secondary-foreground text-sm leading-relaxed">
            SpaceWise is an educational app that helps people learn from real space mission failures.
          </p>
          <p className="text-secondary-foreground text-sm leading-relaxed">
            Browse missions from NASA, ESA, ISRO, and others. Each mission has a short summary, a clear "lesson learned," and an optional key fact. Try the Apollo 13 scenario and test your knowledge with the quiz.
          </p>
          <p className="text-secondary-foreground text-sm leading-relaxed">
            A listen feature reads mission text aloud with adjustable speed to support different reading preferences.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="gradient-card rounded-xl border border-primary/20 p-5 shadow-card">
          <p className="text-primary text-sm font-medium text-center">
            We learn from space mission failures to build a better future — in space and on Earth.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center mt-8">
          <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for the Apple Swift Student Challenge
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
