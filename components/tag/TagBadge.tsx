import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagBadgeProps {
  tag: Tag;
  className?: string;
}

const TagBadge = ({ tag, className }: TagBadgeProps) => {
  // Generate contrasting text color based on background color
  const getTextColor = (hexColor: string) => {
    // Remove # if present
    const color =
      hexColor.charAt(0) === "#" ? hexColor.substring(1, 7) : hexColor;
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return black or white depending on luminance
    return luminance > 0.5 ? "text-gray-800" : "text-white";
  };

  return (
    <Badge
      className={cn("font-normal border-0", getTextColor(tag.color), className)}
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
    </Badge>
  );
};

export default TagBadge;
