import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Heart, BookOpen, Zap, Volume2, Users } from "lucide-react";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
  { icon: BookOpen, label: "Mission Explorer", desc: "Browse real missions from NASA, ESA, ISRO and more" },
  { icon: Zap, label: "What If Scenarios", desc: "Make decisions and see how they compare to history" },
  { icon: Volume2, label: "Listen Along", desc: "Text-to-speech with adjustable speed for accessibility" },
  { icon: Users, label: "Inclusive Design", desc: "Supports diverse learning styles and screen readers" },
];

const About = () => {
  const navigate = useNavigate();

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
            <Rocket className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">SpaceWise Lite</h1>
          <p className="text-muted-foreground text-sm">Compact Lessons from Space</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 mb-4 shadow-card">
          <p className="text-secondary-foreground text-sm leading-relaxed">
            SpaceWise is an educational app that helps people learn from real space mission failures and successes. Every failure taught us something — SpaceWise makes those lessons easy to discover and remember.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 mb-4">
          {features.map((f) => (
            <div key={f.label} className="glass rounded-2xl border border-border/40 p-4">
              <f.icon className="w-5 h-5 text-primary mb-2.5" />
              <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-primary/20 p-5 shadow-card ring-glow">
          <p className="text-primary text-sm font-medium text-center leading-relaxed">
            We learn from space mission failures to build a better future — in space and on Earth. 🌍
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center mt-8">
          <p className="text-muted-foreground text-xs flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-destructive" /> for learning
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
