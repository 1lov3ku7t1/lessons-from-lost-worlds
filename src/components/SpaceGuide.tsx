import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Palette } from "lucide-react";

/* ─── avatar options ─── */
const avatarOptions = [
  "🧑‍🚀", "👩‍🚀", "👨‍🚀", "🤖", "👽", "🛸",
  "🚀", "🌍", "🪐", "⭐", "🌙", "☄️",
  "🐱", "🦊", "🐻‍❄️", "🐶", "🦉", "🐙",
  "🧙‍♂️", "🧑‍🔬", "👾", "🎃", "🦄", "🐉",
];

/* ─── route-specific tips ─── */
const routeTips: Record<string, { title: string; messages: string[] }> = {
  "/": {
    title: "Welcome! 👋",
    messages: [
      "I'm your space guide! I'll help you explore SpaceWise.",
      "Tap 'Explore Missions' to learn from real space mission failures & successes.",
      "Try the Quiz to test your knowledge, or check your Progress & Stats!",
    ],
  },
  "/missions": {
    title: "Mission Library 🛰️",
    messages: [
      "Here you'll find real missions from NASA, ESA, ISRO and more.",
      "Each card shows the mission status — tap one to dive deeper!",
      "Look for the 🎮 icon to play interactive games about each mission.",
    ],
  },
  "/quiz": {
    title: "Quiz Time! 🧠",
    messages: [
      "Test what you've learned about space missions!",
      "Each correct answer earns you points toward badges.",
      "Don't worry about mistakes — that's how we learn, just like in space! 🚀",
    ],
  },
  "/progress": {
    title: "Your Journey 🏆",
    messages: [
      "Track everything you've accomplished here.",
      "Earn badges by reading missions, playing games, and acing quizzes!",
      "Can you collect them all? Keep exploring to find out!",
    ],
  },
  "/stats": {
    title: "Data Dashboard 📊",
    messages: [
      "Explore patterns in space mission data.",
      "See which agencies had the most failures, and during which decade.",
      "Data visualization helps us spot trends humans might miss!",
    ],
  },
  "/about": {
    title: "About SpaceWise ℹ️",
    messages: [
      "SpaceWise turns space failures into valuable lessons.",
      "Every feature is designed to be accessible and inclusive for all learners.",
    ],
  },
  "/scenario": {
    title: "What If? 🤔",
    messages: [
      "Here you make decisions as if you were mission control!",
      "See how your choices compare to what really happened in history.",
    ],
  },
};

const missionDetailTips = {
  title: "Mission Deep Dive 🔍",
  messages: [
    "Read the full story of this mission — what happened and why.",
    "Tap 'Listen' to hear the story read aloud!",
    "Try the interactive game to experience the mission yourself.",
  ],
};

/* ─── onboarding for first visit ─── */
const onboardingSteps = [
  {
    title: "Hey there! 🚀",
    message: "I'm your friendly space guide. I'll help you navigate SpaceWise and learn from real space missions!",
  },
  {
    title: "Learn from Failures 💡",
    message: "Every space mission failure taught us something important. Explore missions, play games, and take quizzes to discover those lessons.",
  },
  {
    title: "Track Your Progress 🏆",
    message: "Earn badges as you learn! I'll be here whenever you need help — just tap my icon. Let's start exploring!",
  },
];

const SpaceGuide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBubble, setShowBubble] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatar, setAvatar] = useState("🧑‍🚀");

  // Load saved avatar
  useEffect(() => {
    const saved = localStorage.getItem("spacewise-avatar");
    if (saved) setAvatar(saved);
  }, []);

  const pickAvatar = (emoji: string) => {
    setAvatar(emoji);
    localStorage.setItem("spacewise-avatar", emoji);
    setShowAvatarPicker(false);
  };

  // First visit onboarding
  useEffect(() => {
    const seen = localStorage.getItem("spacewise-onboarded");
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  // Reset tip index when route changes
  useEffect(() => {
    setTipIndex(0);
    setDismissed(false);
    if (!showOnboarding) {
      setShowBubble(true);
      const t = setTimeout(() => setShowBubble(false), 6000);
      return () => clearTimeout(t);
    }
  }, [location.pathname, showOnboarding]);

  const currentTips = location.pathname.startsWith("/missions/")
    ? location.pathname.includes("/game")
      ? { title: "Game Time! 🎮", messages: ["Make the right decisions to save the mission!", "Your score counts toward badges. Good luck!"] }
      : missionDetailTips
    : routeTips[location.pathname] || { title: "Exploring! 🌌", messages: ["Tap around to discover more about space missions!"] };

  const finishOnboarding = () => {
    localStorage.setItem("spacewise-onboarded", "true");
    setShowOnboarding(false);
    setShowBubble(true);
  };

  /* ─── onboarding overlay ─── */
  if (showOnboarding) {
    const step = onboardingSteps[onboardingStep];
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-sm"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full gradient-accent shadow-glow flex items-center justify-center"
              >
                <span className="text-5xl">{avatar}</span>
              </motion.div>
            </div>

            <div className="glass rounded-3xl border border-border/40 p-6 shadow-elevated text-center">
              <h2 className="font-heading font-bold text-foreground text-xl mb-3">{step.title}</h2>
              <p className="text-secondary-foreground text-sm leading-relaxed mb-6">{step.message}</p>

              {/* Step dots */}
              <div className="flex justify-center gap-2 mb-5">
                {onboardingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? "bg-primary w-6" : "bg-border"}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep((s) => s - 1)}
                    className="flex-1 py-3 rounded-2xl glass border border-border/40 text-secondary-foreground font-heading font-medium text-sm transition-all hover:border-primary/30"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < onboardingSteps.length - 1) {
                      setOnboardingStep((s) => s + 1);
                    } else {
                      finishOnboarding();
                    }
                  }}
                  className="flex-1 py-3 rounded-2xl gradient-accent text-primary-foreground font-heading font-semibold text-sm shadow-glow hover:opacity-90 transition-all"
                >
                  {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Let's Go! 🚀"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ─── floating guide ─── */
  return (
    <>
      {/* Avatar picker modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-background/60 backdrop-blur-sm px-6 pb-24"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 22 }}
              className="w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-3xl border border-border/40 p-5 shadow-elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground text-sm">Choose Your Guide</h3>
                  <button
                    onClick={() => setShowAvatarPicker(false)}
                    className="w-7 h-7 rounded-lg glass-subtle flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => pickAvatar(emoji)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 ${
                        avatar === emoji
                          ? "gradient-accent shadow-glow ring-2 ring-primary/50"
                          : "glass-subtle hover:bg-accent/10"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-24 left-6 right-6 z-[60] max-w-xs mx-auto"
          >
            <div className="glass rounded-2xl border border-border/40 p-4 shadow-elevated relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="w-6 h-6 rounded-full glass-subtle flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Change avatar"
                >
                  <Palette className="w-3 h-3" />
                </button>
                <button
                  onClick={() => { setShowBubble(false); setDismissed(true); }}
                  className="w-6 h-6 rounded-full glass-subtle flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs font-heading font-semibold text-primary mb-1.5">{currentTips.title}</p>
              <p className="text-sm text-secondary-foreground leading-relaxed pr-8">
                {currentTips.messages[tipIndex]}
              </p>

              {currentTips.messages.length > 1 && (
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1">
                    {currentTips.messages.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === tipIndex ? "bg-primary w-4" : "bg-border"}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {tipIndex > 0 && (
                      <button
                        onClick={() => setTipIndex((t) => t - 1)}
                        className="w-7 h-7 rounded-lg glass-subtle flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {tipIndex < currentTips.messages.length - 1 && (
                      <button
                        onClick={() => setTipIndex((t) => t + 1)}
                        className="w-7 h-7 rounded-lg glass-subtle flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 glass border-r border-b border-border/40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => { setShowBubble(!showBubble); setDismissed(false); }}
        className="fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full gradient-accent shadow-glow flex items-center justify-center hover:opacity-90 transition-all"
        aria-label="Space guide"
      >
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-2xl"
        >
          {avatar}
        </motion.span>
      </motion.button>
    </>
  );
};

export default SpaceGuide;
