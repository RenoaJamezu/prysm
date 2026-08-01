import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Category } from "../../types";
import type { CategoryFormValues } from "../../schemas/category.schema";

import CategoryDialog from "./CategoryDialog";
import CategoryItem from "./CategoryItem";

type CategoryListProps = {
  categories: Category[];
  loading: boolean;

  create: (values: CategoryFormValues) => Promise<Category>;
  update: (id: string, values: CategoryFormValues) => Promise<Category>;
  remove: (id: string) => Promise<void>;
};

export default function CategoryList({
  categories,
  loading,
  create,
  update,
  remove,
}: CategoryListProps) {
  const [open, setOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  async function handleSubmit(values: CategoryFormValues) {
    if (selectedCategory) {
      await update(selectedCategory.id, values);
      return;
    }

    await create(values);
  }

  function handleCreate() {
    setSelectedCategory(undefined);
    setOpen(true);
  }

  function handleEdit(category: Category) {
    setSelectedCategory(category);
    setOpen(true);
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Category
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No categories yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </section>

      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
      />
    </>
  );
}
