"use client";

import { Task } from "@/api/out";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: number, completed: boolean) => void;
  onCreateTask: () => void;
  onDeleteTask?: (taskId: number) => void;
  isLoading?: boolean;
}

const TaskList = ({
  tasks,
  onTaskClick,
  onTaskStatusChange,
  onCreateTask,
  onDeleteTask,
  isLoading = false,
}: TaskListProps) => {
  // Sort tasks: in_progress first, then pending, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = {
      in_progress: 0,
      pending: 1,
      completed: 2,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <Button
          onClick={onCreateTask}
          className="rounded-full"
          disabled={isLoading}
        >
          <Plus className="mr-1 h-4 w-4" />
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first task to get started
          </p>
          <Button onClick={onCreateTask} disabled={isLoading}>
            <Plus className="mr-1 h-4 w-4" />
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onStatusChange={onTaskStatusChange}
              onDelete={onDeleteTask ? () => onDeleteTask(task.id) : undefined}
              delay={index * 50}
              disabled={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
