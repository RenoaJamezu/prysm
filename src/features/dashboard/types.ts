import type { Product } from "@/features/products/types";

export interface CartItem {
  product: Product;

  quantity: number;
}

export interface CartState {
  items: CartItem[];

  notes: string;

  addProduct(product: Product): void;

  removeProduct(productId: string): void;

  increaseQuantity(productId: string): void;

  decreaseQuantity(productId: string): void;

  clear(): void;

  setNotes(notes: string): void;

  totalItems(): number;

  totalAmount(): number;
}