import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Category } from "../../types";
import type { CategoryFormValues } from "../../schemas/category.schema";

import CategoryList from "./CategoryList";

type CategoryManagerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  categories: Category[];
  loading: boolean;

  create: (values: CategoryFormValues) => Promise<Category>;
  update: (id: string, values: CategoryFormValues) => Promise<Category>;
  remove: (id: string) => Promise<void>;
};

export default function CategoryManagerDialog({
  open,
  onOpenChange,
  categories,
  loading,
  create,
  update,
  remove,
}: CategoryManagerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-2/5 overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <CategoryList
          categories={categories}
          loading={loading}
          create={create}
          update={update}
          remove={remove}
        />
      </DialogContent>
    </Dialog>
  );
}
