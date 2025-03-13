import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

type Priority = "low" | "medium" | "high";

interface PriorityConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const priorityConfigs: Record<Priority, PriorityConfig> = {
  low: {
    label: "Low",
    color: "text-priority-low",
    icon: <ArrowDownIcon className="h-4 w-4" />,
  },
  medium: {
    label: "Medium",
    color: "text-priority-medium",
    icon: <ArrowRightIcon className="h-4 w-4" />,
  },
  high: {
    label: "High",
    color: "text-priority-high",
    icon: <ArrowUpIcon className="h-4 w-4" />,
  },
};

interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

const PriorityIndicator = ({
  priority,
  showLabel = false,
  className,
}: PriorityIndicatorProps) => {
  const config = priorityConfigs[priority];

  return (
    <div className={cn("flex items-center gap-1.5", config.color, className)}>
      {config.icon}
      {showLabel && <span className="text-sm font-medium">{config.label}</span>}
    </div>
  );
};

export default PriorityIndicator;
