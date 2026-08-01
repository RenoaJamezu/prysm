import { useMemo, useState } from "react";

import type { OrderStatus } from "@/features/orders/types";

import { useQueue } from "../hooks/useQueue";

import QueueBoard from "../components/QueueBoard";

import { Button } from "@/components/ui/button";

const STATUSES: {
  label: string;
  value: OrderStatus | "all";
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export default function QueuePage() {
  const { orders, loading, updateStatus } = useQueue();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "preparing",
  );

  const filteredOrders = useMemo(() => {
    if (selectedStatus === "all") {
      return orders;
    }

    return orders.filter((order) => order.order_status === selectedStatus);
  }, [orders, selectedStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kitchen Queue</h1>

        <p className="text-muted-foreground">
          Manage incoming customer orders.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {STATUSES.map((status) => (
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
