"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Tag } from "@/api/out";
import {
  deleteTagMutation,
  getTagsListOptions,
  getTagsListQueryKey,
  getTasksListOptions,
  updateTagMutation as putTagMutation,
  storeTagMutation,
} from "@/api/out/@tanstack/react-query.gen";

import FadeIn from "@/components/animations/FadeIn";
import Header from "@/components/Navbar";
import DeleteTagDialog from "@/components/tag/DeleteTagDialog";
import SearchHeader from "@/components/tag/SearchHeader";
import TagFormDialog from "@/components/tag/TagFormDialog";
import TagList from "@/components/tag/TagList";
import { TagFormValues, tagSchema } from "@/schema/tag.schema";
import { getSubmissionColor, normalizeColor } from "@/utils/color";

export default function Tags() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      color: "#0EA5E9",
    },
  });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useQuery({
    ...getTagsListOptions(),
  });

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useQuery({
    ...getTasksListOptions(),
  });

  const createTagMutation = useMutation({
    ...storeTagMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTagsListQueryKey() });
      toast.success("Tag created successfully");
      setTagDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create tag");
    },
  });

  const updateTagMutation = useMutation({
    ...putTagMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTagsListQueryKey() });
      toast.success("Tag updated successfully");
      setTagDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update tag");
    },
  });

  const deleteTagMutationHook = useMutation({
    ...deleteTagMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTagsListQueryKey() });
      toast.success("Tag deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedTagId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete tag");
    },
  });

  const filteredTags = tagsData?.data
    ? tagsData.data.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getTagTaskCount = (tagId: number) => {
    if (!tasksData?.data) return 0;
    return tasksData.data.filter((task) =>
      task.tags?.some((tag) => tag.id === tagId)
    ).length;
  };

  const handleCreateTag = () => {
    form.reset({
      name: "",
      color: "#0EA5E9",
    });
    setSelectedTagId(null);
    setTagDialogOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    const normalizedColor = normalizeColor(tag.color);

    form.reset({
      name: tag.name,
      color: normalizedColor,
    });
    setSelectedTagId(tag.id);
    setTagDialogOpen(true);
  };

  const handleDeleteTag = (tag: Tag) => {
    setSelectedTagId(tag.id);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (values: TagFormValues) => {
    const submissionValues = {
      ...values,
      color: getSubmissionColor(values.color),
    };

    if (selectedTagId) {
      updateTagMutation.mutate({
        path: { id: selectedTagId },
        body: submissionValues,
      });
    } else {
      createTagMutation.mutate({
        body: submissionValues,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedTagId) return;

    deleteTagMutationHook.mutate({
      path: { id: selectedTagId },
    });
  };

  const isLoading = isTagsLoading || isTasksLoading;
  const isError = isTagsError || isTasksError;
  const isSubmitting =
    createTagMutation.isPending || updateTagMutation.isPending;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto pt-24 px-4 md:px-6">
        <FadeIn className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Organize your tasks with custom tags
          </p>
        </FadeIn>

        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTag={handleCreateTag}
        />

        <TagList
          isLoading={isLoading}
          isError={isError}
          filteredTags={filteredTags}
          searchQuery={searchQuery}
          handleCreateTag={handleCreateTag}
          handleEditTag={handleEditTag}
          handleDeleteTag={handleDeleteTag}
          getTagTaskCount={getTagTaskCount}
        />

        <TagFormDialog
          open={tagDialogOpen}
          onOpenChange={setTagDialogOpen}
          form={form}
          onSubmit={onSubmit}
          selectedTagId={selectedTagId}
          isSubmitting={isSubmitting}
        />

        <DeleteTagDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteTagMutationHook.isPending}
        />
      </main>
    </div>
  );
}
