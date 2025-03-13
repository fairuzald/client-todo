import { isValidColorInput } from "@/utils/color";
import * as z from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tag name is required" })
    .max(20, { message: "Tag name cannot exceed 20 characters" })
    .refine((name) => !/^\s*$/.test(name), {
      message: "Tag name cannot be only whitespace",
    }),
  color: z.string().superRefine((val, ctx) => {
    if (!isValidColorInput(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid color (hex format)",
      });
      return false;
    }
    return true;
  }),
});

export type TagFormValues = z.infer<typeof tagSchema>;
