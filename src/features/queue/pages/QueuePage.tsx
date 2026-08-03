import { useMemo, useState } from "react";

import type { OrderStatus } from "@/features/orders/types";

import { useQueue } from "../hooks/useQueue";

import QueueBoard from "../components/QueueBoard";

import { Button } from "@/components/ui/button";

function isToday(date: string) {
  const today = new Date();
  const value = new Date(date);

  return (
    today.getFullYear() === value.getFullYear() &&
    today.getMonth() === value.getMonth() &&
    today.getDate() === value.getDate()
  );
}

export default function QueuePage() {
  const { orders, loading, updateStatus } = useQueue();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "preparing",
  );

  const todayOrders = useMemo(
    () => orders.filter((order) => isToday(order.created_at)),
    [orders],
  );

  const counts = useMemo(
    () => ({
      preparing: orders.filter((o) => o.order_status === "preparing").length,

      completed: todayOrders.filter((o) => o.order_status === "completed")
        .length,

      cancelled: todayOrders.filter((o) => o.order_status === "cancelled")
        .length,
    }),
    [orders, todayOrders],
  );

  const filteredOrders = useMemo(() => {
    let data = orders;

    if (selectedStatus !== "all") {
      data = data.filter((order) => order.order_status === selectedStatus);
    }

    if (selectedStatus === "completed" || selectedStatus === "cancelled") {
      data = data.filter((order) => isToday(order.created_at));
    }

    return [...data].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [orders, selectedStatus]);

  const statuses = [
    {
      label: "All",
      value: "all",
    },
    {
      label: `Preparing (${counts.preparing})`,
      value: "preparing",
    },
    {
      label: `Completed (${counts.completed})`,
      value: "completed",
    },
    {
      label: `Cancelled (${counts.cancelled})`,
      value: "cancelled",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kitchen Queue</h1>

        <p className="text-muted-foreground">
          Manage incoming customer orders.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={selectedStatus === status.value ? "default" : "outline"}
            onClick={() => setSelectedStatus(status.value)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      <QueueBoard
        orders={filteredOrders}
        loading={loading}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
