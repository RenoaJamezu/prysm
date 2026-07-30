import { z } from "zod";

export const productSchema = z.object({
  category_id: z.string().uuid().nullable(),

  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(80, "Product name must be at most 80 characters."),

  image_url: z.instanceof(File).nullable().optional(),

  selling_price: z
    .number({
      error: "Selling price is required.",
    })
    .min(0, "Selling price cannot be negative."),

  unit_cost: z.number().nullable(),

  is_visible: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
