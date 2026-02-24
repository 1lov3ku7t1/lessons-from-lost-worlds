import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, AlertCircle, Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from "recharts";
import { missions } from "@/data/missions";
import { missionTelemetryData } from "@/data/missionTelemetry";
import StarField from "@/components/StarField";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const eventTypeColors: Record<string, string> = {
  info: "text-primary border-primary/20 bg-primary/10",
  warning: "text-warning border-warning/20 bg-warning/10",
  critical: "text-destructive border-destructive/20 bg-destructive/10",
};

const MissionData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);
  const telemetry = missionTelemetryData.find((t) => t.missionId === id);

  if (!mission || !telemetry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Mission data not found.</p>
      </div>
    );
  }

  const annotatedPoints = telemetry.data.filter((d) => d.label);

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
            onClick={() => navigate(`/missions/${id}`)}
            className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-primary/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center text-xl">
              {mission.icon}
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">{mission.name}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Mission Telemetry & Data
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-4 mb-4 shadow-card">
          <h2 className="font-heading font-semibold text-foreground text-sm mb-1">{telemetry.title}</h2>
          <div className="flex gap-4 text-[10px] text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded bg-primary inline-block" /> {telemetry.unit.altitude}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded bg-accent inline-block" /> {telemetry.unit.velocity}
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry.data} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="alt"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  width={40}
                />
                <YAxis
                  yAxisId="vel"
                  orientation="right"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line
                  yAxisId="alt"
                  type="monotone"
                  dataKey="altitude"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
                <Line
                  yAxisId="vel"
                  type="monotone"
                  dataKey="velocity"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--accent))" }}
                />
                {annotatedPoints.map((p, i) => (
                  <ReferenceDot
                    key={i}
                    yAxisId="alt"
                    x={p.time}
                    y={p.altitude}
                    r={4}
                    fill="hsl(var(--warning))"
                    stroke="hsl(var(--warning))"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Annotations */}
          {annotatedPoints.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {annotatedPoints.map((p, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                  {p.time}: {p.label}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Key Events Timeline */}
        <motion.div variants={fadeInUp} className="glass rounded-2xl border border-border/40 p-5 shadow-card">
          <h2 className="font-heading font-semibold text-foreground text-sm mb-4">Key Events Timeline</h2>
          <div className="space-y-3">
            {telemetry.keyEvents.map((event, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${eventTypeColors[event.type]}`}>
                <div className="mt-0.5 shrink-0">
                  {event.type === "critical" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : event.type === "warning" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{event.time}</span>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MissionData;
