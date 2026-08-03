import { useState } from "react";
import { toast } from "sonner";

import { orderService } from "../services/order.service";

import type { CreateOrderInput } from "../types";

export function useOrders() {
  const [loading, setLoading] = useState(false);

  async function createOrder(input: CreateOrderInput) {
    try {
      setLoading(true);

      const order = await orderService.create(input);

      toast.success("Order added to queue.");

      return order;
    } catch (error) {
      toast.error("Unable to save order.");

      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,

    createOrder,
  };
}
