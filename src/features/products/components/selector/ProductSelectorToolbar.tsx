import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Category } from "../../types";

type ProductSelectorToolbarProps = {
  searchQuery: string;
  selectedCategoryId: string | null;
  categories: Category[];

  onSearchQueryChange(value: string): void;
  onSelectedCategoryChange(value: string | null): void;
};

export default function ProductSelectorToolbar({
  searchQuery,
  selectedCategoryId,
  categories,
  onSearchQueryChange,
  onSelectedCategoryChange,
}: ProductSelectorToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={searchQuery}
          placeholder="Search products..."
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={selectedCategoryId ?? "all"}
        onValueChange={(value) =>
          onSelectedCategoryChange(value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-full lg:w-60">
          <SelectValue>
            {selectedCategoryId === null
              ? "All Categories"
              : categories.find((c) => c.id === selectedCategoryId)?.name}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
