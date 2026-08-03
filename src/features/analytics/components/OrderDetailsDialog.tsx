import { useEffect, useState } from "react";
import { format } from "date-fns";

import type { AnalyticsOrder } from "../types";

import { analyticsService } from "../services/analytics.service";

import type { OrderItem } from "@/features/orders/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;

  order: AnalyticsOrder | null;

  onOpenChange(open: boolean): void;
};

export default function OrderDetailsDialog({
  open,
  order,
  onOpenChange,
}: Props) {
  const [items, setItems] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !order) return;

    const currentOrder = order;

    async function load() {
      setLoading(true);

      try {
        const result = await analyticsService.getOrderItems(currentOrder.id);

        setItems(result);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open, order]);

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ticket {order.ticket_code}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className="capitalize">{order.order_status}</Badge>

            <span className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
            </span>
          </div>

          {order.notes && (
            <div>
              <p className="text-sm font-medium">Notes</p>

              <p className="text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <div className="space-y-2">
            {loading ? (
              <p>Loading...</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{item.product_name}</p>

                    <p className="text-sm text-muted-foreground">
                      ₱{Number(item.selling_price).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>x{item.quantity}</p>

                    <p className="font-semibold">
                      ₱{Number(item.subtotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>

            <span>
              ₱
              {Number(order.total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
