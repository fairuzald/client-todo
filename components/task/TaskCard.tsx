"use client";

import { Task } from "@/api/out";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import FadeIn from "../animations/FadeIn";
import PriorityIndicator from "../PriorityIndicator";
import StatusBadge from "../StatusBadge";
import TagBadge from "../tag/TagBadge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onStatusChange: (taskId: number, completed: boolean) => void;
  onDelete?: () => void;
  className?: string;
  delay?: number;
  disabled?: boolean;
}

const TaskCard = ({
  task,
  onClick,
  onStatusChange,
  onDelete,
  className,
  delay = 0,
  disabled = false,
}: TaskCardProps) => {
  const isCompleted = task.status === "completed";

  const handleCheckboxChange = (checked: boolean) => {
    if (!disabled) {
      onStatusChange(task.id, checked);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick(task);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !disabled) {
      onDelete();
    }
  };

  return (
    <FadeIn delay={delay}>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md cursor-pointer glass",
          isCompleted && "opacity-70",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
              disabled={disabled}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    "font-medium text-base mr-auto",
                    isCompleted && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={handleDelete}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete task</span>
                    </Button>
                  )}
                  <PriorityIndicator
                    priority={task.priority}
                    className="shrink-0"
                  />
                </div>
              </div>

              {task.description && (
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <StatusBadge status={task.status} />

                {task.due_date && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(task.due_date), "MMM d, yyyy")}
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {task.tags?.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default TaskCard;
