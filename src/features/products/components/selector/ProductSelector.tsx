import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";

import type { Product } from "../../types";

import { usePagination } from "@/hooks/usePagination";

import ProductSelectorToolbar from "./ProductSelectorToolbar";
import ProductSelectorGrid from "./ProductSelectorGrid";
import ProductPagination from "../products/ProductPagination";

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

  const { page, totalPages, currentItems, goTo } = usePagination({
    items: filteredProducts,
    pageSize: 8,
  });

  return (
    <div className="space-y-6">
      <ProductSelectorToolbar
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        categories={categories}
        onSearchQueryChange={setSearchQuery}
        onSelectedCategoryChange={setSelectedCategoryId}
      />

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
