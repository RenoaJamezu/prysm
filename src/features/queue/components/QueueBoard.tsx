import type { QueueOrderWithItems } from "../types";

import type { OrderStatus } from "@/features/orders/types";

import QueueCard from "./QueueCard";
import QueueEmptyState from "./QueueEmptyState";
import QueueSkeleton from "./QueueSkeleton";

type QueueBoardProps = {
  orders: QueueOrderWithItems[];

  loading: boolean;

  onUpdateStatus(orderId: string, status: OrderStatus): Promise<void>;
};

export default function QueueBoard({
  orders,
  loading,
  onUpdateStatus,
}: QueueBoardProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <QueueSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <QueueEmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <QueueCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}
