import { supabase } from "@/lib/supabase";

import type { CreateOrderInput, Order, OrderItem, OrderStatus } from "../types";

const ORDERS_TABLE = "orders";
const ORDER_ITEMS_TABLE = "order_items";

export const orderService = {
  async create(input: CreateOrderInput): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from(ORDERS_TABLE)
      .insert({
        business_id: input.business_id,
        order_status: "preparing" satisfies OrderStatus,
        notes: input.notes,
        subtotal: input.subtotal,
        discount: input.discount,
        tax: input.tax,
        total: input.total,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    const items = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      selling_price: item.selling_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from(ORDER_ITEMS_TABLE)
      .insert(items);

    if (itemsError) {
      await supabase.from(ORDERS_TABLE).delete().eq("id", order.id);

      throw itemsError;
    }

    return order as Order;
  },

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from(ORDER_ITEMS_TABLE)
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data as OrderItem[];
  },
};
