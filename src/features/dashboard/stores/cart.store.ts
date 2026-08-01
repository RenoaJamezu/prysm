import { create } from "zustand";

import type { Product } from "@/features/products/types";

import type { CartState } from "../types";

function calculateTotalItems(items: CartState["items"]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function calculateTotalAmount(items: CartState["items"]) {
  return items.reduce(
    (total, item) => total + Number(item.product.selling_price) * item.quantity,
    0,
  );
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  notes: "",

  addProduct(product: Product) {
    const existing = get().items.find((item) => item.product.id === product.id);

    if (existing) {
      set((state) => ({
        items: state.items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      }));

      return;
    }

    set((state) => ({
      items: [
        ...state.items,
        {
          product,
          quantity: 1,
        },
      ],
    }));
  },

  removeProduct(productId) {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  increaseQuantity(productId) {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    }));
  },

  decreaseQuantity(productId) {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  clear() {
    set({
      items: [],
      notes: "",
    });
  },

  setNotes(notes) {
    set({
      notes,
    });
  },

  totalItems() {
    return calculateTotalItems(get().items);
  },

  totalAmount() {
    return calculateTotalAmount(get().items);
  },
}));
