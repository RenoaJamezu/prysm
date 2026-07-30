import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/AppProvider";

import { productService } from "../services/product.service";
import type { Product, ProductInput } from "../types";

export function useProducts() {
  const { business } = useApp();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!business) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await productService.getAll(business.id);

      setProducts(result);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [business]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(input: ProductInput) {
    if (!business) {
      throw new Error("Business not found.");
    }

    try {
      const product = await productService.create(business.id, input);

      setProducts((previous) => [product, ...previous]);

      toast.success("Product created.");

      return product;
    } catch (error) {
      console.error(error);

      toast.error("Failed to create product.");

      throw error;
    }
  }

  async function update(id: string, input: ProductInput) {
    if (!business) {
      throw new Error("Business not found.");
    }

    try {
      const updated = await productService.update(business.id, id, input);

      setProducts((previous) =>
        previous.map((product) => (product.id === id ? updated : product)),
      );

      toast.success("Product updated.");

      return updated;
    } catch (error) {
      console.error(error);

      toast.error("Failed to update product.");

      throw error;
    }
  }

  async function remove(id: string) {
    try {
      await productService.remove(id);

      setProducts((previous) =>
        previous.filter((product) => product.id !== id),
      );

      toast.success("Product deleted.");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete product.");

      throw error;
    }
  }

  async function updateVisibility(id: string, visible: boolean) {
    try {
      const updated = await productService.updateVisibility(id, visible);

      setProducts((previous) =>
        previous.map((product) => (product.id === id ? updated : product)),
      );

      toast.success(
        visible ? "Product is now visible." : "Product hidden from menu.",
      );
    } catch (error) {
      toast.error("Failed to update product visibility.");

      throw error;
    }
  }

  return {
    products,
    loading,

    refresh,

    create,
    update,
    remove,
    updateVisibility,
  };
}
