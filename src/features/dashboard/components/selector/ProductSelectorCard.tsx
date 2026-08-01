import { useMemo } from "react";
import { ImageOff } from "lucide-react";

import type { Category, Product } from "../../../products/types";
import { productService } from "../../../products/services/product.service";

import { useCartStore } from "@/features/dashboard/stores/cart.store";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.product.id === product.id),
  );

  const quantity = cartItem?.quantity ?? 0;

  const imageUrl = product.image_url
    ? productService.getImageUrl(product.image_url)
    : "/images/product-placeholder.png";

  function handleSelect() {
    onSelect(product);
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={cn(
        "group overflow-hidden rounded-2xl border p-0 shadow-sm transition-all duration-200",
        "cursor-pointer hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]",
        quantity > 0
          ? "border-primary ring-2 ring-primary/20"
          : "hover:border-primary",
      )}
    >
      {/* Image */}
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

        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-black/15" />

        <div className="absolute left-4 top-4">
          <Badge className="rounded-full bg-white/90 px-3 py-1 font-medium text-black backdrop-blur">
            {category?.name ?? "Uncategorized"}
          </Badge>
        </div>

        {quantity > 0 && (
          <div className="absolute right-4 top-4">
            <Badge className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">
              Qty: {quantity}
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-3 p-5">
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
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-t px-5 py-4 text-center transition-colors",
          quantity > 0 && "bg-primary/5",
        )}
      >
        <span
          className={cn(
            "text-sm font-medium",
            quantity > 0
              ? "text-primary"
              : "text-muted-foreground group-hover:text-primary",
          )}
        >
          {quantity > 0 ? "Tap to add more" : "Tap to add"}
        </span>
      </div>
    </Card>
  );
}
