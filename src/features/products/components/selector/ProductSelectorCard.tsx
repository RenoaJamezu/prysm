import { useMemo } from "react";
import { ImageOff } from "lucide-react";

import type { Category, Product } from "../../types";
import { productService } from "../../services/product.service";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ProductSelectorCardProps = {
  product: Product;
  categories: Category[];

  onSelect: (product: Product) => void;
};

export default function ProductSelectorCard({
  product,
  categories,
  onSelect,
}: ProductSelectorCardProps) {
  const category = useMemo(
    () => categories.find((item) => item.id === product.category_id),
    [categories, product.category_id],
  );

  const imageUrl = product.image_url
    ? productService.getImageUrl(product.image_url)
    : "/images/product-placeholder.png";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(product);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border p-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg active:scale-[0.99]"
    >
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
      </div>

      <div className="space-y-2 p-5">
        <h3 className="truncate text-lg font-semibold">{product.name}</h3>

        <p className="text-2xl font-bold text-primary">
          ₱
          {Number(product.selling_price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="border-t px-5 py-4 text-center">
        <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary">
          Tap to add
        </span>
      </div>
    </Card>
  );
}
