import type { Category, Product } from "../../types";

import ProductCard from "../cards/ProductCard";
import ProductCardSkeleton from "../cards/ProductCardSkeleton";
import ProductEmptyState from "./ProductEmptyState";

type ProductGridProps = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  
  onCreateProduct: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  onVisibilityChange: (id: string, visible: boolean) => Promise<void>;
};

export default function ProductGrid({
  products,
  categories,
  loading,
  onCreateProduct,
  onEdit,
  onDelete,
  onVisibilityChange,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <ProductEmptyState onCreateProduct={onCreateProduct} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onVisibilityChange={onVisibilityChange}
        />
      ))}
    </div>
  );
}
