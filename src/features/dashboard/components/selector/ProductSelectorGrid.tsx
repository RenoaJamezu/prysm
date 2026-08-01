import type { Category, Product } from "../../../products/types";
import ProductEmptyState from "../../../products/components/products/ProductEmptyState";

import ProductSelectorCard from "./ProductSelectorCard";
import ProductCardSkeleton from "@/features/products/components/products/ProductCardSkeleton";

type ProductSelectorGridProps = {
  products: Product[];
  categories: Category[];

  loading: boolean;

  onCreateProduct?: () => void;

  onSelect(product: Product): void;
};

export default function ProductSelectorGrid({
  products,
  categories,
  loading,
  onCreateProduct,
  onSelect,
}: ProductSelectorGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <ProductEmptyState onCreateProduct={onCreateProduct ?? (() => {})} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductSelectorCard
          key={product.id}
          product={product}
          categories={categories}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
