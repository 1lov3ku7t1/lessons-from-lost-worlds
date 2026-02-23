import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "first-mission", label: "Explorer", icon: "🔭", description: "Read your first mission" },
  { id: "all-missions", label: "Mission Master", icon: "🛰️", description: "Read all 7 missions" },
  { id: "first-game", label: "Player One", icon: "🎮", description: "Complete your first mini-game" },
  { id: "perfect-game", label: "Perfectionist", icon: "💯", description: "Score 100% on any game" },
  { id: "quiz-complete", label: "Quiz Whiz", icon: "🧠", description: "Complete the quiz" },
  { id: "quiz-ace", label: "Space Scholar", icon: "🎓", description: "Score 100% on the quiz" },
  { id: "scenario-complete", label: "Decision Maker", icon: "⚡", description: "Complete Apollo 13 scenario" },
  { id: "all-games", label: "Game Champion", icon: "🏆", description: "Complete all mini-games" },
];

interface ProgressData {
  missionsRead: string[];
  gamesCompleted: Record<string, number>; // missionId -> best score
  quizBestScore: number | null;
  scenarioCompleted: boolean;
  badges: string[];
}

interface ProgressContextType {
  progress: ProgressData;
  markMissionRead: (id: string) => void;
  recordGameScore: (missionId: string, score: number) => void;
  recordQuizScore: (score: number) => void;
  markScenarioComplete: () => void;
  getEarnedBadges: () => Badge[];
  getProgressPercent: () => number;
}

const defaultProgress: ProgressData = {
  missionsRead: [],
  gamesCompleted: {},
  quizBestScore: null,
  scenarioCompleted: false,
  badges: [],
};

const ProgressContext = createContext<ProgressContextType>({
  progress: defaultProgress,
  markMissionRead: () => {},
  recordGameScore: () => {},
  recordQuizScore: () => {},
  markScenarioComplete: () => {},
  getEarnedBadges: () => [],
  getProgressPercent: () => 0,
});

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const saved = localStorage.getItem("spacewise-progress");
      return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem("spacewise-progress", JSON.stringify(progress));
  }, [progress]);

  const computeBadges = (p: ProgressData): string[] => {
    const badges: string[] = [];
    if (p.missionsRead.length >= 1) badges.push("first-mission");
    if (p.missionsRead.length >= 7) badges.push("all-missions");
    if (Object.keys(p.gamesCompleted).length >= 1) badges.push("first-game");
    if (Object.values(p.gamesCompleted).some((s) => s === 100)) badges.push("perfect-game");
    if (p.quizBestScore !== null) badges.push("quiz-complete");
    if (p.quizBestScore === 100) badges.push("quiz-ace");
    if (p.scenarioCompleted) badges.push("scenario-complete");
    if (Object.keys(p.gamesCompleted).length >= 7) badges.push("all-games");
    return badges;
  };

  const updateAndBadge = (updater: (prev: ProgressData) => ProgressData) => {
    setProgress((prev) => {
      const next = updater(prev);
      next.badges = computeBadges(next);
      return next;
    });
  };

  const markMissionRead = (id: string) => {
    updateAndBadge((prev) => ({
      ...prev,
      missionsRead: prev.missionsRead.includes(id) ? prev.missionsRead : [...prev.missionsRead, id],
    }));
  };

  const recordGameScore = (missionId: string, score: number) => {
    updateAndBadge((prev) => ({
      ...prev,
      gamesCompleted: {
        ...prev.gamesCompleted,
        [missionId]: Math.max(prev.gamesCompleted[missionId] || 0, score),
      },
    }));
  };

  const recordQuizScore = (score: number) => {
    updateAndBadge((prev) => ({
      ...prev,
      quizBestScore: prev.quizBestScore !== null ? Math.max(prev.quizBestScore, score) : score,
    }));
  };

  const markScenarioComplete = () => {
    updateAndBadge((prev) => ({ ...prev, scenarioCompleted: true }));
  };

  const getEarnedBadges = () => ALL_BADGES.filter((b) => progress.badges.includes(b.id));

  const getProgressPercent = () => {
    // Total possible: 7 missions + 7 games + quiz + scenario = 16 items
    const total = 16;
    const done = progress.missionsRead.length + Object.keys(progress.gamesCompleted).length + (progress.quizBestScore !== null ? 1 : 0) + (progress.scenarioCompleted ? 1 : 0);
    return Math.round((done / total) * 100);
  };

  return (
    <ProgressContext.Provider value={{ progress, markMissionRead, recordGameScore, recordQuizScore, markScenarioComplete, getEarnedBadges, getProgressPercent }}>
      {children}
    </ProgressContext.Provider>
  );
};
