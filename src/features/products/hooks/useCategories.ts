import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { categoryService } from "../services/category.service";
import type { Category, CategoryInput } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await categoryService.getAll();

      setCategories(result);
    } catch (error) {
      toast.error("Failed to load categories.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(input: CategoryInput) {
    try {
      const category = await categoryService.create(input);

      setCategories((previous) =>
        [...previous, category].sort(
          (a, b) =>
            a.display_order - b.display_order || a.name.localeCompare(b.name),
        ),
      );

      toast.success("Category created.");

      return category;
    } catch (error) {
      toast.error("Failed to create category.");
      throw error;
    }
  }

  async function update(id: string, input: CategoryInput) {
    try {
      const updated = await categoryService.update(id, input);

      setCategories((previous) =>
        previous
          .map((category) => (category.id === id ? updated : category))
          .sort(
            (a, b) =>
              a.display_order - b.display_order || a.name.localeCompare(b.name),
          ),
      );

      toast.success("Category updated.");

      return updated;
    } catch (error) {
      toast.error("Failed to update category.");
      throw error;
    }
  }

  async function remove(id: string) {
    try {
      await categoryService.remove(id);

      setCategories((previous) =>
        previous.filter((category) => category.id !== id),
      );

      toast.success("Category deleted.");
    } catch (error) {
      toast.error("Failed to delete category.");
      throw error;
    }
  }

  return {
    categories,
    loading,

    refresh,

    create,
    update,
    remove,
  };
}
