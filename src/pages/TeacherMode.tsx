import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, GraduationCap, Clock, Target, BookOpen,
  MessageSquare, Beaker, ClipboardCheck, ChevronDown, ChevronUp,
  Layers, Bookmark
} from "lucide-react";
import { missions } from "@/data/missions";
import { lessonPlans, LessonPlan } from "@/data/teacherLessons";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const SectionToggle = ({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-4 text-left hover:bg-muted/20 transition-colors"
      >
        <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-heading font-semibold text-foreground text-sm flex-1">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LessonCard = ({ plan, missionName, missionIcon }: { plan: LessonPlan; missionName: string; missionIcon: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 shadow-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/10 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl glass border border-border/40 flex items-center justify-center text-2xl shrink-0">
          {missionIcon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-foreground text-base truncate">{missionName}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />Grades {plan.gradeLevel}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{plan.duration}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Objectives */}
              <SectionToggle icon={Target} title="Learning Objectives" color="gradient-accent">
                <ul className="space-y-1.5">
                  {plan.objectives.map((obj, i) => (
                    <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{obj}
                    </li>
                  ))}
                </ul>
              </SectionToggle>

              {/* Standards */}
              <SectionToggle icon={Bookmark} title="Standards Alignment" color="bg-success/20">
                <div className="flex flex-wrap gap-2">
                  {plan.standards.map((std, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 font-medium">
                      {std}
                    </span>
                  ))}
                </div>
              </SectionToggle>

              {/* Vocabulary */}
              <SectionToggle icon={BookOpen} title="Key Vocabulary" color="bg-warning/20">
                <div className="flex flex-wrap gap-2">
                  {plan.vocabulary.map((word, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-warning/10 text-warning border border-warning/20 font-medium">
                      {word}
                    </span>
                  ))}
                </div>
              </SectionToggle>

              {/* Discussion Prompts */}
              <SectionToggle icon={MessageSquare} title="Discussion Prompts" color="bg-accent/20">
                <ul className="space-y-2.5">
                  {plan.discussionPrompts.map((prompt, i) => (
                    <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">{i + 1}.</span>
                      <span className="italic">{prompt}</span>
                    </li>
                  ))}
                </ul>
              </SectionToggle>

              {/* Activities */}
              <SectionToggle icon={Beaker} title="Hands-On Activities" color="bg-primary/20">
                <div className="space-y-3">
                  {plan.activities.map((act, i) => (
                    <div key={i} className="glass rounded-lg border border-border/30 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-heading font-semibold text-foreground">{act.title}</h4>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{act.duration}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-foreground leading-relaxed">{act.description}</p>
                    </div>
                  ))}
                </div>
              </SectionToggle>

              {/* Assessment */}
              <SectionToggle icon={ClipboardCheck} title="Assessment" color="bg-destructive/20">
                <p className="text-sm text-secondary-foreground leading-relaxed">{plan.assessment}</p>
              </SectionToggle>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TeacherMode = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen px-6 py-10"
    >
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

        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Teacher Mode</h1>
              <p className="text-xs text-muted-foreground">Lesson plans for aerospace education</p>
            </div>
          </div>
          <p className="text-sm text-secondary-foreground leading-relaxed">
            Each mission includes NGSS-aligned lesson plans with learning objectives, discussion prompts, hands-on activities, and assessment ideas. Tap a mission to expand its full lesson plan.
          </p>
        </motion.div>

        <div className="space-y-4">
          {lessonPlans.map((plan) => {
            const mission = missions.find((m) => m.id === plan.missionId);
            if (!mission) return null;
            return (
              <LessonCard
                key={plan.missionId}
                plan={plan}
                missionName={mission.name}
                missionIcon={mission.icon}
              />
            );
          })}
        </div>

        <motion.div variants={fadeInUp} className="mt-8 glass rounded-2xl border border-primary/20 p-5 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-semibold text-foreground text-sm">How to Use in Class</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-secondary-foreground">
            <li className="flex items-start gap-2"><span className="text-primary">1.</span>Pick a mission and review its lesson plan</li>
            <li className="flex items-start gap-2"><span className="text-primary">2.</span>Show the 8-bit replay as a lesson hook</li>
            <li className="flex items-start gap-2"><span className="text-primary">3.</span>Use discussion prompts for class conversation</li>
            <li className="flex items-start gap-2"><span className="text-primary">4.</span>Run the hands-on activity</li>
            <li className="flex items-start gap-2"><span className="text-primary">5.</span>Assign the quiz or scenario as assessment</li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherMode;
