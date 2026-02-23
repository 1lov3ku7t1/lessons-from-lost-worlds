import { MissionStatus } from "@/data/missions";

interface StatusBadgeProps {
  status: MissionStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<MissionStatus, string> = {
    Success: "bg-success/20 text-success border-success/30",
    Partial: "bg-warning/20 text-warning border-warning/30",
    Failure: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
