import TagBadge from "@/components/tag/TagBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagFormValues } from "@/schema/tag.schema";
import { getSafeColor } from "@/utils/color";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import ColorPicker from "../ColorPicker";

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<TagFormValues>;
  onSubmit: (values: TagFormValues) => void;
  selectedTagId: number | null;
  isSubmitting: boolean;
}

const TagFormDialog: React.FC<TagFormDialogProps> = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  selectedTagId,
  isSubmitting,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) form.reset();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTagId ? "Edit Tag" : "Create New Tag"}
          </DialogTitle>
          <DialogDescription>
            {selectedTagId
              ? "Update your tag details below."
              : "Give your tag a name and color."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter tag name"
                      className="transition-apple"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <FormLabel>Preview</FormLabel>
              <div className="mt-1.5 flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: getSafeColor(form.watch("color")),
                  }}
                ></div>
                <TagBadge
                  tag={{
                    id: selectedTagId || 0,
                    name: form.watch("name") || "Tag Preview",
                    color: getSafeColor(form.watch("color")),
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedTagId ? "Saving..." : "Creating..."}
                  </>
                ) : selectedTagId ? (
                  "Save Changes"
                ) : (
                  "Create Tag"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TagFormDialog;
