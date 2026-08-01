import type { OrderStatus } from "@/features/orders/types";

export interface QueueOrder {
  id: string;

  ticket_code: string;

  business_id: string;

  order_status: OrderStatus;

  notes: string | null;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  created_at: string;
}

export interface QueueOrderItem {
  id: string;

  order_id: string;

  product_id: string;

  product_name: string;

  selling_price: number;

  quantity: number;

  subtotal: number;

  created_at: string;
}

export interface QueueOrderWithItems extends QueueOrder {
  items: QueueOrderItem[];
}
