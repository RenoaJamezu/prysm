import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

import { useApp } from "@/app/providers/AppProvider";

import type { OrderStatus } from "@/features/orders/types";

import { queueService } from "../services/queue.service";
import type { QueueOrderWithItems } from "../types";
import { sound } from "@/lib/sound";

export function useQueue() {
  const { business } = useApp();

  const [orders, setOrders] = useState<QueueOrderWithItems[]>([]);

  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!business) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const result = await queueService.getOrders(business.id);

      setOrders(result);
    } catch (error) {
      toast.error("Failed to load queue.");
    } finally {
      setLoading(false);
    }
  }, [business]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!business) return;

    const channel = supabase
      .channel(`orders-${business.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `business_id=eq.${business.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            sound.playNewOrder();
          }

          await refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business, refresh]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      const updated = await queueService.updateStatus(orderId, status);

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...updated,
              }
            : order,
        ),
      );

      toast.success("Order updated.");
    } catch (error) {
      toast.error("Failed to update order.");
    }
  }

  return {
    orders,
    loading,

    refresh,

    updateStatus,
  };
}
