import { useMemo } from "react";

import type { Product } from "../types";

type UseFilteredProductsProps = {
  products: Product[];
  searchQuery: string;
  selectedCategoryId: string | null;
};

export function useFilteredProducts({
  products,
  searchQuery,
  selectedCategoryId,
}: UseFilteredProductsProps) {
  return useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategoryId || product.category_id === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryId]);
}
