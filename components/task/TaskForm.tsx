"use client";

import { Tag, Task } from "@/api/out";
import { getTagsListOptions } from "@/api/out/@tanstack/react-query.gen";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  Loader2,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import PriorityIndicator from "../PriorityIndicator";
import StatusBadge from "../StatusBadge";
import TagBadge from "../tag/TagBadge";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

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
        setFormData({
          ...task,
          description: task.description || "",
          tags: task.tags || [],
        });
        setDate(task.due_date ? new Date(task.due_date) : undefined);
      } else {
        setFormData(defaultTask);
        setDate(undefined);
      }
      setShowCalendar(false);
      setTagSelectorOpen(false);
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

  const removeTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t.id !== tagId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogContent className="sm:max-w-[500px]">
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
            {/* Title Field */}
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

            {/* Description Field */}
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

            {/* Status and Priority in Grid */}
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

            {/* Due Date Field */}
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant={date ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    date
                      ? "bg-primary text-primary-foreground"
                      : "bg-background",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                  {date && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-4 w-4 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDate();
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Button>
              </div>

              {showCalendar && (
                <div className="rounded-md border mt-1 p-1 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={isSubmitting}
                    className="rounded-md border-0"
                    initialFocus
                  />
                </div>
              )}
            </div>

            {/* Tags Field with Command Menu */}
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="relative">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between text-left font-normal bg-background"
                    disabled={isSubmitting || isTagsLoading}
                    onClick={() => setTagSelectorOpen(!tagSelectorOpen)}
                  >
                    <div className="flex items-center">
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
                    </div>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </div>

                {tagSelectorOpen && (
                  <div className="absolute z-10 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                    <Command className="w-full">
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {availableTags.map((tag) => {
                          const isSelected = formData.tags?.some(
                            (t) => t.id === tag.id
                          );
                          return (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => toggleTag(tag)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-sm border",
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "opacity-50"
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <TagBadge tag={tag} />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </div>
                )}
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{
                        backgroundColor: tag.color,
                        color: getTextColor(tag.color),
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      {tag.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag.id)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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

// Helper function to determine appropriate text color based on background color
function getTextColor(bgColor: string): string {
  // Remove # if present
  const hex = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance - perceived brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default TaskForm;
