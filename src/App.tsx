import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import { ProgressProvider } from "@/hooks/useProgress";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import SpaceGuide from "@/components/SpaceGuide";
import Index from "./pages/Index";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import Scenario from "./pages/Scenario";
import Quiz from "./pages/Quiz";
import About from "./pages/About";
import MissionGame from "./pages/MissionGame";
import Progress from "./pages/Progress";
import Stats from "./pages/Stats";
import TeacherMode from "./pages/TeacherMode";
import Walkthrough from "./pages/Walkthrough";
import StudentTracker from "./pages/StudentTracker";
import MissionData from "./pages/MissionData";
import NarrativeOnboarding from "./pages/NarrativeOnboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetail />} />
        <Route path="/missions/:id/game" element={<MissionGame />} />
        <Route path="/scenario/:id" element={<Scenario />} />
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/missions/:id/data" element={<MissionData />} />
        <Route path="/onboarding" element={<NarrativeOnboarding />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<About />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/teacher" element={<TeacherMode />} />
        <Route path="/walkthrough/:id" element={<Walkthrough />} />
        <Route path="/students" element={<StudentTracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <ProgressProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <SpaceGuide />
            <AccessibilityPanel />
          </BrowserRouter>
        </TooltipProvider>
      </ProgressProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
