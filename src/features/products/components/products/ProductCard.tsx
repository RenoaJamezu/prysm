import { useMemo } from "react";
import { MoreVertical, Pencil, Trash2, ImageOff } from "lucide-react";

import type { Category, Product } from "../../types";
import { productService } from "../../services/product.service";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductCardProps = {
  product: Product;

  categories: Category[];

  onEdit: (product: Product) => void;

  onDelete: (id: string) => Promise<void>;

  onVisibilityChange?: (id: string, visible: boolean) => Promise<void>;
};

export default function ProductCard({
  product,
  categories,
  onEdit,
  onDelete,
  onVisibilityChange,
}: ProductCardProps) {
  const category = useMemo(
    () => categories.find((item) => item.id === product.category_id),
    [categories, product.category_id],
  );

  const margin = useMemo(() => {
    if (product.unit_cost == null || product.selling_price <= 0) {
      return null;
    }

    return (
      ((product.selling_price - product.unit_cost) / product.selling_price) *
      100
    );
  }, [product]);

  const imageUrl = product.image_url
    ? productService.getImageUrl(product.image_url)
    : "/images/product-placeholder.png";

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${product.name}"?`);

    if (!confirmed) return;

    await onDelete(product.id);
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border p-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/20" />

        <div className="absolute left-4 top-4">
          <Badge
            variant="secondary"
            className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black backdrop-blur"
          >
            {category?.name ?? "Uncategorized"}
          </Badge>
        </div>

        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity duration-200 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="rounded-full bg-white/90 backdrop-blur p-2">
                <MoreVertical className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="truncate text-lg font-semibold">{product.name}</h3>

          <p className="mt-1 text-2xl font-bold text-primary">
            ₱
            {Number(product.selling_price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cost</span>

            <span className="font-medium">
              {product.unit_cost == null
                ? "—"
                : `₱${Number(product.unit_cost).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Margin</span>

            <span
              className={`font-semibold ${
                margin == null
                  ? ""
                  : margin >= 50
                    ? "text-green-600"
                    : margin >= 25
                      ? "text-yellow-600"
                      : "text-red-600"
              }`}
            >
              {margin == null ? "—" : `${margin.toFixed(0)}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-5 py-4">
        <div>
          <p className="text-sm font-medium">Available on Menu</p>

          <p className="text-xs text-muted-foreground">Visible to dashboard</p>
        </div>

        <Switch
          checked={product.is_visible}
          onCheckedChange={(checked) =>
            onVisibilityChange?.(product.id, checked)
          }
        />
      </div>
    </Card>
  );
}
