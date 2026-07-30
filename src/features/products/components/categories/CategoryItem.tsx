import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Category } from "../../types";

type CategoryItemProps = {
  category: Category;

  onEdit: (category: Category) => void;

  onDelete: (id: string) => Promise<void>;
};

export default function CategoryItem({
  category,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    await onDelete(category.id);
  }

  return (
    <div className="flex w-full items-center justify-between rounded-full border bg-card px-4 py-2 shadow-sm transition hover:border-primary">
      <span className="font-medium">{category.name}</span>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
