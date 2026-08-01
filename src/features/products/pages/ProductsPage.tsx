import { useState } from "react";

import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

import type { Product } from "../types";
import type { ProductFormValues } from "../schemas/product.schema";

import ProductToolbar from "../components/products/ProductToolbar";
import ProductGrid from "../components/products/ProductGrid";
import ProductDialog from "../components/products/ProductDialog";
import CategoryManagerDialog from "../components/categories/CategoryManagerDialog";
import { usePagination } from "@/hooks/usePagination";
import ProductPagination from "../components/products/ProductPagination";
import { useFilteredProducts } from "../hooks/useFilteredProducts";

export default function ProductsPage() {
  const {
    categories,
    loading: categoriesLoading,

    create,
    update,
    remove,
  } = useCategories();

  const {
    products,
    loading: productsLoading,

    create: createProduct,
    update: updateProduct,
    remove: removeProduct,
    updateVisibility,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  function handleCreateProduct() {
    setSelectedProduct(undefined);

    setProductDialogOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);

    setProductDialogOpen(true);
  }

  async function handleSubmit(values: ProductFormValues) {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, values);

      return;
    }

    await createProduct(values);
  }

  const filteredProducts = useFilteredProducts({
    products,
    searchQuery,
    selectedCategoryId,
  });

  const PAGE_SIZE = 8;

  const { page, totalPages, currentItems, goTo } = usePagination({
    items: filteredProducts,
    pageSize: PAGE_SIZE,
  });

  const start = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const end = Math.min(page * PAGE_SIZE, filteredProducts.length);

  return (
    <>
      <div className="space-y-6">
        <ProductToolbar
          searchQuery={searchQuery}
          selectedCategoryId={selectedCategoryId}
          categories={categories}
          onSearchQueryChange={setSearchQuery}
          onSelectedCategoryChange={setSelectedCategoryId}
          onCreateProduct={handleCreateProduct}
          onManageCategories={() => setCategoryDialogOpen(true)}
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

        <ProductGrid
          loading={productsLoading}
          products={currentItems}
          categories={categories}
          onCreateProduct={handleCreateProduct}
          onEdit={handleEditProduct}
          onDelete={removeProduct}
          onVisibilityChange={updateVisibility}
        />

        {!productsLoading && (
          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={goTo}
          />
        )}
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <CategoryManagerDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        loading={categoriesLoading}
        create={create}
        update={update}
        remove={remove}
      />
    </>
  );
}
