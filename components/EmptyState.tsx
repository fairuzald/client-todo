import { ClipboardList } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-secondary p-4 mb-4 animate-float">
          <ClipboardList className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-medium mt-2">{title}</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-balance">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-6">
            {actionLabel}
          </Button>
        )}
      </div>
    </FadeIn>
  );
};

export default EmptyState;
