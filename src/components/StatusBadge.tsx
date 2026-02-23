import { MissionStatus } from "@/data/missions";

interface StatusBadgeProps {
  status: MissionStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<MissionStatus, string> = {
    Success: "bg-success/15 text-success border-success/25 shadow-[0_0_12px_hsl(152_60%_46%/0.1)]",
    Partial: "bg-warning/15 text-warning border-warning/25 shadow-[0_0_12px_hsl(38_92%_55%/0.1)]",
    Failure: "bg-destructive/15 text-destructive border-destructive/25 shadow-[0_0_12px_hsl(0_72%_55%/0.1)]",
  };

  const dots: Record<MissionStatus, string> = {
    Success: "bg-success",
    Partial: "bg-warning",
    Failure: "bg-destructive",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
