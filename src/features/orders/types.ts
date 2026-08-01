import type { Product } from "@/features/products/types";

export type OrderStatus = "preparing" | "ready" | "completed" | "cancelled";

export interface Order {
  id: string;

  business_id: string;

  order_number: number;

  order_status: OrderStatus;

  notes: string | null;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  created_at: string;

  updated_at: string;
}

export interface OrderItem {
  id: string;

  order_id: string;

  product_id: string | null;

  product_name: string;

  selling_price: number;

  quantity: number;

  subtotal: number;

  created_at: string;
}

export interface CreateOrderInput {
  business_id: string;

  notes: string | null;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  product_id: string | null;

  product_name: string;

  selling_price: number;

  quantity: number;

  subtotal: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export function createOrderItem(
  product: Product,
  quantity: number,
): CreateOrderItemInput {
  return {
    product_id: product.id,
    product_name: product.name,
    selling_price: Number(product.selling_price),
    quantity,
    subtotal: Number(product.selling_price) * quantity,
  };
}
