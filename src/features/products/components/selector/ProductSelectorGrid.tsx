import type { Category, Product } from "../../types";
import ProductCardSkeleton from "../cards/ProductCardSkeleton";
import ProductEmptyState from "../products/ProductEmptyState";

import ProductSelectorCard from "./ProductSelectorCard";

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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
