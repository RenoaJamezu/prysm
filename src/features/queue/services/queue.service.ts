import { supabase } from "@/lib/supabase";

import type { OrderStatus } from "@/features/orders/types";

import type { QueueOrder, QueueOrderItem, QueueOrderWithItems } from "../types";

const ORDERS_TABLE = "orders";
const ORDER_ITEMS_TABLE = "order_items";

export const queueService = {
  getOrders,
  updateStatus,
};

async function getOrders(businessId: string): Promise<QueueOrderWithItems[]> {
  const { data: orders, error } = await supabase
    .from(ORDERS_TABLE)
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);

  const { data: items, error: itemsError } = await supabase
    .from(ORDER_ITEMS_TABLE)
    .select("*")
    .in("order_id", orderIds)
    .order("created_at", {
      ascending: true,
    });

  if (itemsError) {
    throw itemsError;
  }

  return (orders as QueueOrder[]).map((order) => ({
    ...order,
    items: (items as QueueOrderItem[]).filter(
      (item) => item.order_id === order.id,
    ),
  }));
}

async function updateStatus(
  orderId: string,
  status: OrderStatus,
): Promise<QueueOrder> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .update({
      order_status: status,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as QueueOrder;
}
