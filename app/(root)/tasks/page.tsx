"use client";

import { Task } from "@/api/out";
import {
  deleteTaskMutation as deleteTaskApi,
  getTagsListOptions,
  getTasksListOptions,
  getTasksListQueryKey,
  storeTaskMutation,
  updateTaskMutation as updateTaskApi,
} from "@/api/out/@tanstack/react-query.gen";
import Header from "@/components/Navbar";
import TaskForm from "@/components/task/TaskForm";
import TaskList from "@/components/task/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtectedRoute } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TasksPage = () => {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentFilter, setCurrentFilter] = useState("all");

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useQuery({
    ...getTasksListOptions(),
  });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    error: tagsError,
  } = useQuery({
    ...getTagsListOptions(),
  });

  const createTaskMutation = useMutation({
    ...storeTaskMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTasksListQueryKey() });
      toast.success("Task created successfully");
      setIsFormOpen(false);
      setCurrentTask(undefined);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  const updateTaskMutation = useMutation({
    ...updateTaskApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTasksListQueryKey() });
      toast.success("Task updated successfully");
      setIsFormOpen(false);
      setCurrentTask(undefined);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    ...deleteTaskApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTasksListQueryKey() });
      toast.success("Task deleted successfully");
      setIsFormOpen(false);
      setCurrentTask(undefined);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate({
        path: { id: taskId },
      });
    }
  };

  const handleSaveTask = (taskData: Task) => {
    if (currentTask?.id) {
      // Update existing task
      updateTaskMutation.mutate({
        path: { id: currentTask.id },
        body: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          due_date: taskData.due_date,
          priority: taskData.priority,
          // Use tag_ids instead of tags
          tag_ids: taskData.tags?.map((tag) => tag.id) || [],
        },
      });
    } else {
      // Create new task
      createTaskMutation.mutate({
        body: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          due_date: taskData.due_date,
          priority: taskData.priority,
          // Use tag_ids instead of tags
          tag_ids: taskData.tags?.map((tag) => tag.id) || [],
        },
      });
    }
  };

  const handleStatusChange = (taskId: number, completed: boolean) => {
    const taskToUpdate = tasksData?.data?.find((task) => task.id === taskId);

    if (taskToUpdate) {
      updateTaskMutation.mutate({
        path: { id: taskId },
        body: {
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          status: completed ? "completed" : "pending",
          due_date: taskToUpdate.due_date,
          priority: taskToUpdate.priority,
          // Use tag_ids instead of tags
          tag_ids: taskToUpdate.tags?.map((tag) => tag.id) || [],
        },
      });
    }
  };

  const isLoading = isAuthLoading || isTasksLoading || isTagsLoading;
  const hasError = tasksError || tagsError;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-destructive mb-4">
          Something went wrong loading your tasks.
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  const tasks = tasksData?.data || [];
  const tags = tagsData?.data || [];

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return task.status === "pending";
    if (currentFilter === "in_progress") return task.status === "in_progress";
    if (currentFilter === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-20">
        <Header />

        <main className="mt-20">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setCurrentFilter}
            value={currentFilter}
          >
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={currentFilter} className="mt-0">
              <TaskList
                tasks={filteredTasks}
                onTaskClick={handleEditTask}
                onTaskStatusChange={handleStatusChange}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                isLoading={
                  createTaskMutation.isPending ||
                  updateTaskMutation.isPending ||
                  deleteTaskMutation.isPending
                }
              />
            </TabsContent>
          </Tabs>
        </main>

        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveTask}
          task={currentTask}
          availableTags={tags}
          isSubmitting={
            createTaskMutation.isPending || updateTaskMutation.isPending
          }
          onDelete={
            currentTask?.id ? () => handleDeleteTask(currentTask.id) : undefined
          }
        />
      </div>
    </div>
  );
};

export default TasksPage;
