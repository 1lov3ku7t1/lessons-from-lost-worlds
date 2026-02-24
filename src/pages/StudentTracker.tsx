import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, Plus, Trash2, CheckCircle2, Circle,
  BookOpen, Gamepad2, HelpCircle, ChevronDown, ChevronUp, GraduationCap
} from "lucide-react";
import { missions } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Student {
  id: string;
  name: string;
  missionsRead: string[];
  gamesCompleted: string[];
  quizScore: number | null;
  walkthroughsCompleted: string[];
}

const STORAGE_KEY = "spacewise-students";

const loadStudents = (): Student[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const StudentTracker = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [newName, setNewName] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  const addStudent = () => {
    const name = newName.trim();
    if (!name) return;
    const student: Student = {
      id: Date.now().toString(),
      name,
      missionsRead: [],
      gamesCompleted: [],
      quizScore: null,
      walkthroughsCompleted: [],
    };
    setStudents((prev) => [...prev, student]);
    setNewName("");
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleItem = (studentId: string, field: "missionsRead" | "gamesCompleted" | "walkthroughsCompleted", itemId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const arr = s[field];
        return {
          ...s,
          [field]: arr.includes(itemId) ? arr.filter((x) => x !== itemId) : [...arr, itemId],
        };
      })
    );
  };

  const setQuizScore = (studentId: string, score: number | null) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, quizScore: score } : s))
    );
  };

  const getStudentProgress = (s: Student) => {
    const total = missions.length * 3 + 1; // missions + games + walkthroughs + quiz
    const done = s.missionsRead.length + s.gamesCompleted.length + s.walkthroughsCompleted.length + (s.quizScore !== null ? 1 : 0);
    return Math.round((done / total) * 100);
  };

  const classAverage = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + getStudentProgress(s), 0) / students.length)
    : 0;

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
            onClick={() => navigate("/teacher")}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Student Tracker</h1>
              <p className="text-xs text-muted-foreground">Track class progress offline</p>
            </div>
          </div>
        </motion.div>

        {/* Class overview */}
        {students.length > 0 && (
          <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-4 mb-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-semibold text-foreground">Class Overview</span>
              <span className="text-xs text-muted-foreground">{students.length} student{students.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${classAverage}%` }} />
              </div>
              <span className="text-sm font-heading font-bold text-foreground">{classAverage}%</span>
            </div>
          </motion.div>
        )}

        {/* Add student */}
        <motion.div variants={fadeInUp} className="flex gap-2 mb-5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStudent()}
            placeholder="Student name..."
            className="flex-1 px-4 py-2.5 rounded-xl glass border border-border/40 bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
          />
          <button
            onClick={addStudent}
            className="px-4 py-2.5 rounded-xl gradient-accent text-primary-foreground font-heading font-semibold text-sm shadow-glow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </motion.div>

        {/* Students list */}
        <div className="space-y-3">
          {students.map((student) => {
            const progress = getStudentProgress(student);
            const isExpanded = expandedId === student.id;

            return (
              <motion.div
                key={student.id}
                variants={fadeInUp}
                className="glass rounded-2xl border border-border/40 shadow-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : student.id)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-sm font-heading font-bold text-primary shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm truncate">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-heading">{progress}%</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        {/* Missions read */}
                        <div>
                          <p className="text-[11px] font-heading font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3" /> Missions Read
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missions.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => toggleItem(student.id, "missionsRead", m.id)}
                                className={`text-[10px] px-2 py-1 rounded-full border font-medium transition-all ${student.missionsRead.includes(m.id) ? "bg-success/15 text-success border-success/25" : "bg-muted/30 text-muted-foreground border-border/40"}`}
                              >
                                {student.missionsRead.includes(m.id) ? <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" /> : <Circle className="w-2.5 h-2.5 inline mr-0.5" />}
                                {m.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Walkthroughs */}
                        <div>
                          <p className="text-[11px] font-heading font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3" /> Walkthroughs
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missions.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => toggleItem(student.id, "walkthroughsCompleted", m.id)}
                                className={`text-[10px] px-2 py-1 rounded-full border font-medium transition-all ${student.walkthroughsCompleted.includes(m.id) ? "bg-primary/15 text-primary border-primary/25" : "bg-muted/30 text-muted-foreground border-border/40"}`}
                              >
                                {student.walkthroughsCompleted.includes(m.id) ? <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" /> : <Circle className="w-2.5 h-2.5 inline mr-0.5" />}
                                {m.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Games */}
                        <div>
                          <p className="text-[11px] font-heading font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <Gamepad2 className="w-3 h-3" /> Games Completed
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missions.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => toggleItem(student.id, "gamesCompleted", m.id)}
                                className={`text-[10px] px-2 py-1 rounded-full border font-medium transition-all ${student.gamesCompleted.includes(m.id) ? "bg-warning/15 text-warning border-warning/25" : "bg-muted/30 text-muted-foreground border-border/40"}`}
                              >
                                {student.gamesCompleted.includes(m.id) ? <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" /> : <Circle className="w-2.5 h-2.5 inline mr-0.5" />}
                                {m.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quiz score */}
                        <div>
                          <p className="text-[11px] font-heading font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <HelpCircle className="w-3 h-3" /> Quiz Score
                          </p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student.quizScore ?? ""}
                            onChange={(e) => setQuizScore(student.id, e.target.value ? Number(e.target.value) : null)}
                            placeholder="Not taken"
                            className="w-24 px-3 py-1.5 rounded-lg glass border border-border/40 bg-transparent text-foreground text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="text-[11px] text-destructive/70 hover:text-destructive flex items-center gap-1 transition-colors mt-2"
                        >
                          <Trash2 className="w-3 h-3" /> Remove student
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {students.length === 0 && (
          <motion.div variants={fadeInUp} className="text-center py-12">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Add students to start tracking their progress</p>
            <p className="text-xs text-muted-foreground/60 mt-1">All data is stored offline on this device</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentTracker;
