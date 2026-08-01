import { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";
import { useFilteredProducts } from "@/features/products/hooks/useFilteredProducts";

import type { Product } from "@/features/products/types";

import ProductSelectorGrid from "./ProductSelectorGrid";
import ProductSelectorToolbar from "./ProductSelectorToolbar";
import ProductPagination from "@/features/products/components/products/ProductPagination";

type ProductSelectorProps = {
  onSelect(product: Product): void;
};

export default function ProductSelector({ onSelect }: ProductSelectorProps) {
  const { products, loading: productsLoading } = useProducts();

  const { categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const filteredProducts = useFilteredProducts({
    products,
    searchQuery,
    selectedCategoryId: selectedCategoryId,
  });

  const PAGE_SIZE = 6;

  const { page, totalPages, currentItems, goTo } = usePagination({
    items: filteredProducts,
    pageSize: PAGE_SIZE,
  });

  const start = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const end = Math.min(page * PAGE_SIZE, filteredProducts.length);

  return (
    <div className="space-y-6">
      <ProductSelectorToolbar
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        categories={categories}
        onSearchQueryChange={setSearchQuery}
        onSelectedCategoryChange={setSelectedCategoryId}
      />

      <div className="grid space-y-2 sm:flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {start}-{end}
          </span>{" "}
          of <span className="font-medium">{filteredProducts.length}</span>{" "}
          products
        </p>

        {!productsLoading && (
          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={goTo}
          />
        )}
      </div>

      <ProductSelectorGrid
        products={currentItems}
        categories={categories}
        loading={productsLoading}
        onSelect={onSelect}
      />

      <ProductPagination
        page={page}
        totalPages={totalPages}
        onPageChange={goTo}
      />
    </div>
  );
}
