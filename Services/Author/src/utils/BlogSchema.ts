
import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .trim(),
    

  description: z
    .string({ required_error: "description is required" })
    .trim()
    .min(1, { message: "Name cannot be empty" }),

  blogContent: z
    .string({ required_error: "blogContent is required" })
    .trim()
    .min(1, { message: "blogContent cannot be empty" }),

  category: z
    .string({ required_error: "category is required" })
    .trim()
    .min(1, { message: "category cannot be empty" }),

  image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .optional(),
});


