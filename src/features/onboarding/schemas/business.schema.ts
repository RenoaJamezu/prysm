import { z } from "zod";

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name is required.")
    .max(100, "Business name is too long."),

  businessType: z
    .string()
    .trim()
    .min(2, "Business type is required.")
    .max(100, "Business type is too long."),

  currency: z.string().min(1, "Currency is required"),

  logo: z.instanceof(File).nullable().optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
