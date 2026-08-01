import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, X } from "lucide-react";

import type { QueueOrderWithItems } from "../types";
import type { OrderStatus } from "@/features/orders/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";

type QueueCardProps = {
  order: QueueOrderWithItems;

  onUpdateStatus(orderId: string, status: OrderStatus): Promise<void>;
};

export default function QueueCard({ order, onUpdateStatus }: QueueCardProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000 * 30);

    return () => window.clearInterval(interval);
  }, []);

  const statusColor = useMemo(() => {
    switch (order.order_status) {
      case "preparing":
        return "bg-amber-100 text-amber-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "";
    }
  }, [order.order_status]);

  const createdTime = useMemo(() => {
    return new Date(order.created_at).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [order.created_at]);

  const elapsedTime = useMemo(() => {
    return formatDistanceToNowStrict(new Date(order.created_at), {
      addSuffix: true,
    });
  }, [order.created_at, now]);

  const ageMinutes = useMemo(() => {
    return (Date.now() - new Date(order.created_at).getTime()) / 1000 / 60;
  }, [order.created_at, now]);

  const ageBorderColor = useMemo(() => {
    if (order.order_status === "completed") {
      return "border-l-green-500";
    }

    if (order.order_status === "cancelled") {
      return "border-l-red-500";
    }

    if (ageMinutes >= 20) {
      return "border-l-red-500";
    }

    if (ageMinutes >= 10) {
      return "border-l-yellow-500";
    }

    return "border-l-green-500";
  }, [ageMinutes, order.order_status]);

  return (
    <Card
      className={`space-y-5 rounded-2xl border-l-6 p-5 transition-colors duration-300 ${ageBorderColor}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ticket
          </p>

          <h2 className="text-3xl font-bold tracking-wide">
            {order.ticket_code}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />

            <span className="hidden sm:flex">{createdTime}</span>

            <span className="hidden sm:flex">•</span>

            <span>{elapsedTime}</span>
          </div>
        </div>

        <Badge className={`capitalize ${statusColor}`}>
          {order.order_status}
        </Badge>
      </div>

      <div className="space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
          >
            <span>{item.product_name}</span>

            <span className="font-semibold">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Notes
          </p>

          <p className="mt-1 text-sm">{order.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground">Total</span>

        <span className="text-lg font-bold text-primary">
          ₱
          {order.total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {order.order_status === "preparing" && (
        <div className="grid gap-3 mt-auto">
          <Button
            className="flex py-2 text-sm h-10"
            onClick={() => onUpdateStatus(order.id, "completed")}
          >
            <Check />
            Mark as Done
          </Button>

          <Button
            variant="destructive"
            className="flex py-2 text-sm h-10"
            onClick={() => onUpdateStatus(order.id, "cancelled")}
          >
            <X />
            Mark as Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
