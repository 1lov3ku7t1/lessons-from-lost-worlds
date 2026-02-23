import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { missions } from "@/data/missions";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Stats = () => {
  const navigate = useNavigate();

  const byStatus = {
    Success: missions.filter((m) => m.status === "Success").length,
    Partial: missions.filter((m) => m.status === "Partial").length,
    Failure: missions.filter((m) => m.status === "Failure").length,
  };

  const byAgency: Record<string, number> = {};
  const byPhase: Record<string, number> = {};
  const byDecade: Record<string, { total: number; failures: number }> = {};

  missions.forEach((m) => {
    byAgency[m.agency] = (byAgency[m.agency] || 0) + 1;
    byPhase[m.phase] = (byPhase[m.phase] || 0) + 1;
    const decade = `${Math.floor(m.year / 10) * 10}s`;
    if (!byDecade[decade]) byDecade[decade] = { total: 0, failures: 0 };
    byDecade[decade].total++;
    if (m.status === "Failure") byDecade[decade].failures++;
  });

  const totalMissions = missions.length;
  const failureRate = Math.round((byStatus.Failure / totalMissions) * 100);

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

        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Mission Statistics</h1>
          </div>
          <p className="text-muted-foreground text-sm">Data-driven insights from space exploration history</p>
        </motion.div>

        {/* Key stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-2xl border border-border/40 p-4 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{totalMissions}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Missions</p>
          </div>
          <div className="glass rounded-2xl border border-border/40 p-4 text-center">
            <p className="text-2xl font-heading font-bold text-destructive">{failureRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Failure Rate</p>
          </div>
          <div className="glass rounded-2xl border border-border/40 p-4 text-center">
            <p className="text-2xl font-heading font-bold text-success">{byStatus.Success}</p>
            <p className="text-xs text-muted-foreground mt-1">Successes</p>
          </div>
        </motion.div>

        {/* Status breakdown visual bar */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 mb-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-primary" />
            <h2 className="font-heading font-semibold text-foreground text-sm">Outcome Distribution</h2>
          </div>
          <div className="flex rounded-full overflow-hidden h-6 mb-3">
            <div className="bg-success flex items-center justify-center" style={{ width: `${(byStatus.Success / totalMissions) * 100}%` }}>
              <span className="text-[10px] font-bold text-success-foreground">{byStatus.Success}</span>
            </div>
            <div className="bg-warning flex items-center justify-center" style={{ width: `${(byStatus.Partial / totalMissions) * 100}%` }}>
              <span className="text-[10px] font-bold text-warning-foreground">{byStatus.Partial}</span>
            </div>
            <div className="bg-destructive flex items-center justify-center" style={{ width: `${(byStatus.Failure / totalMissions) * 100}%` }}>
              <span className="text-[10px] font-bold text-destructive-foreground">{byStatus.Failure}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" />Success</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" />Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" />Failure</span>
          </div>
        </motion.div>

        {/* By Agency */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 mb-4 shadow-card">
          <h2 className="font-heading font-semibold text-foreground text-sm mb-4">By Agency</h2>
          <div className="space-y-3">
            {Object.entries(byAgency).sort((a, b) => b[1] - a[1]).map(([agency, count]) => (
              <div key={agency}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{agency}</span>
                  <span className="text-muted-foreground">{count} mission{count > 1 ? "s" : ""}</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full gradient-accent rounded-full transition-all duration-700" style={{ width: `${(count / totalMissions) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* By Phase */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 mb-4 shadow-card">
          <h2 className="font-heading font-semibold text-foreground text-sm mb-4">Failure by Mission Phase</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byPhase).map(([phase, count]) => (
              <div key={phase} className="glass-subtle rounded-xl border border-border/30 px-4 py-3 text-center">
                <p className="text-lg font-heading font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">{phase}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-heading font-semibold text-foreground text-sm">By Decade</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(byDecade).sort().map(([decade, data]) => (
              <div key={decade} className="flex items-center gap-3">
                <span className="text-xs font-heading font-bold text-foreground w-10">{decade}</span>
                <div className="flex-1 h-8 bg-border/20 rounded-lg overflow-hidden flex">
                  <div
                    className="bg-destructive/60 flex items-center justify-center"
                    style={{ width: `${(data.failures / data.total) * 100}%` }}
                  >
                    {data.failures > 0 && <span className="text-[10px] font-bold text-destructive-foreground">{data.failures}</span>}
                  </div>
                  <div
                    className="bg-success/40 flex items-center justify-center"
                    style={{ width: `${((data.total - data.failures) / data.total) * 100}%` }}
                  >
                    {data.total - data.failures > 0 && <span className="text-[10px] font-bold text-success-foreground">{data.total - data.failures}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{data.total}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Stats;
