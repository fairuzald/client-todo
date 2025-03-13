import { cn } from "@/lib/utils";
import { CheckIcon, ClockIcon, PlayIcon } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";

type TaskStatus = "pending" | "in_progress" | "completed";

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const statusConfigs: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    color: "bg-status-pending/10 text-status-pending border-status-pending/20",
    icon: <ClockIcon className="h-3 w-3" />,
  },
  in_progress: {
    label: "In Progress",
    color:
      "bg-status-in_progress/10 text-status-in_progress border-status-in_progress/20",
    icon: <PlayIcon className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color:
      "bg-status-completed/10 text-status-completed border-status-completed/20",
    icon: <CheckIcon className="h-3 w-3" />,
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfigs[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 font-normal py-1",
        config.color,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusBadge;
