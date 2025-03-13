"use client";

import { Tag, Task } from "@/api/out";
import { getTagsListOptions } from "@/api/out/@tanstack/react-query.gen";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckSquare,
  Loader2,
  TagIcon,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import PriorityIndicator from "../PriorityIndicator";
import StatusBadge from "../StatusBadge";
import TagBadge from "../tag/TagBadge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: () => void;
  task?: Task;
  availableTags?: Tag[];
  isSubmitting?: boolean;
}

// Default task with all required properties
const defaultTask: Task = {
  id: 0,
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  user_id: 0,
  due_date: null,
  tags: [],
};

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  task,
  availableTags: propTags,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Task>(defaultTask);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);

  // Fetch tags if not provided as props
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    ...getTagsListOptions(),
    enabled: !propTags || propTags.length === 0,
  });

  // Determine which tags to use
  const availableTags = propTags?.length ? propTags : tagsData?.data || [];

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (open) {
      if (task) {
        // Use the existing task with proper defaults for optional fields
        setFormData({
          ...task,
          description: task.description || "",
          tags: task.tags || [],
        });

        // Set date if available
        setDate(task.due_date ? new Date(task.due_date) : undefined);
      } else {
        setFormData(defaultTask);
        setDate(undefined);
      }
      // Reset UI states
      setShowCalendar(false);
      setShowTagSelector(false);
    }
  }, [open, task]);

  const isEditing = !!task?.id;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "pending" | "in_progress" | "completed",
    }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: value as "low" | "medium" | "high",
    }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      due_date: selectedDate ? selectedDate : null,
    }));
    setShowCalendar(false);
  };

  const clearDate = () => {
    setDate(undefined);
    setFormData((prev) => ({
      ...prev,
      due_date: null,
    }));
  };

  const toggleTag = (tag: Tag) => {
    setFormData((prev) => {
      const isSelected = prev.tags?.some((t) => t.id === tag.id);

      return {
        ...prev,
        tags: isSelected
          ? (prev.tags || []).filter((t) => t.id !== tag.id)
          : [...(prev.tags || []), tag],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the task has all required fields before submitting
    const taskToSubmit: Task = {
      ...formData,
      description: formData.description || null,
      tags: formData.tags || [],
    };

    onSave(taskToSubmit);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isSubmitting && !isOpen && onClose()}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[900px] overflow-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{isEditing ? "Edit Task" : "Create New Task"}</span>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  disabled={isSubmitting}
                  className="h-8"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter task title"
                className="bg-background"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Describe your task (optional)"
                className="min-h-[100px] bg-background"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <StatusBadge status="pending" />
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <StatusBadge status="in_progress" />
                    </SelectItem>
                    <SelectItem value="completed">
                      <StatusBadge status="completed" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={handlePriorityChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <PriorityIndicator priority="low" showLabel />
                    </SelectItem>
                    <SelectItem value="medium">
                      <PriorityIndicator priority="medium" showLabel />
                    </SelectItem>
                    <SelectItem value="high">
                      <PriorityIndicator priority="high" showLabel />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>

                {date && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={clearDate}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {showCalendar && (
                <Card className="mt-1">
                  <CardContent className="p-1">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={isSubmitting}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tag Selection */}
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background"
                  disabled={isSubmitting || isTagsLoading}
                  onClick={() => setShowTagSelector(!showTagSelector)}
                >
                  {isTagsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TagIcon className="mr-2 h-4 w-4" />
                  )}
                  {isTagsLoading
                    ? "Loading tags..."
                    : formData.tags && formData.tags.length > 0
                    ? `${formData.tags.length} tags selected`
                    : "Select tags"}
                </Button>

                {showTagSelector && (
                  <Card className="mt-1">
                    <CardContent className="p-1">
                      <ScrollArea className="h-48 w-full">
                        <div className="grid gap-1.5 p-1">
                          {isTagsLoading ? (
                            <div className="flex justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm">
                                Loading tags...
                              </span>
                            </div>
                          ) : availableTags.length > 0 ? (
                            availableTags.map((tag) => (
                              <div
                                key={tag.id}
                                className="flex items-center space-x-2 p-2 rounded hover:bg-secondary cursor-pointer"
                                onClick={() => toggleTag(tag)}
                              >
                                <CheckSquare
                                  className={cn(
                                    "h-4 w-4",
                                    formData.tags?.some((t) => t.id === tag.id)
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )}
                                />
                                <TagBadge tag={tag} />
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center">
                              <p className="text-muted-foreground text-sm">
                                No tags available
                              </p>
                              <p className="text-xs mt-1">
                                Create tags in the Tags section.
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {formData.tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
