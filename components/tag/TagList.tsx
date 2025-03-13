import { Tag } from "@/api/out";
import FadeIn from "@/components/animations/FadeIn";
import TagBadge from "@/components/tag/TagBadge";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2, Plus, Tag as TagIcon, Trash2 } from "lucide-react";

interface TagListProps {
  isLoading: boolean;
  isError: boolean;
  filteredTags: Tag[];
  searchQuery: string;
  handleCreateTag: () => void;
  handleEditTag: (tag: Tag) => void;
  handleDeleteTag: (tag: Tag) => void;
  getTagTaskCount: (tagId: number) => number;
}

const TagList: React.FC<TagListProps> = ({
  isLoading,
  isError,
  filteredTags,
  searchQuery,
  handleCreateTag,
  handleEditTag,
  handleDeleteTag,
  getTagTaskCount,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tags...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-destructive">
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  if (filteredTags.length === 0) {
    return (
      <FadeIn delay={200}>
        <div className="text-center py-20">
          <TagIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No tags found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "Create a new tag to organize your tasks"}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={handleCreateTag}>
              <Plus className="mr-1 h-4 w-4" /> Create Tag
            </Button>
          )}
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTags.map((tag, index) => (
        <FadeIn key={tag.id} delay={100 + index * 50}>
          <div
            className="bg-card rounded-xl border shadow-subtle hover:shadow-card transition-apple p-4"
            style={{ borderLeft: `4px solid ${tag.color}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <h3 className="font-medium">{tag.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {getTagTaskCount(tag.id)} tasks
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <TagBadge tag={tag} />

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleEditTag(tag)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteTag(tag)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
};

export default TagList;
