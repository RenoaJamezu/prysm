import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";

import type { AnalyticsOrder } from "../types";

import OrderDetailsDialog from "./OrderDetailsDialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrdersTableProps = {
  loading: boolean;
  orders: AnalyticsOrder[];
};

const PAGE_SIZE = 10;

export default function OrdersTable({ loading, orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<AnalyticsOrder | null>(
    null,
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) =>
      order.ticket_code.toLowerCase().includes(keyword),
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  if (loading) {
    return (
      <Card className="rounded-2xl p-6">
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border bg-card p-0 shadow-xs">
        <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Recent Orders</h2>

            <p className="text-sm text-muted-foreground">
              Click an order to view its details.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search ticket..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-30 font-semibold text-muted-foreground">
                  Ticket
                </TableHead>

                <TableHead className="w-35 font-semibold text-muted-foreground">
                  Status
                </TableHead>

                <TableHead className="text-right font-semibold text-muted-foreground">
                  Total
                </TableHead>

                <TableHead className="text-right font-semibold text-muted-foreground">
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-muted/60 p-2.5 text-muted-foreground/60">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>

                      <p className="text-sm font-medium text-muted-foreground">
                        No orders found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                    className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/45"
                  >
                    <TableCell className="font-mono text-sm font-semibold tracking-tight text-foreground">
                      #{order.ticket_code}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          order.order_status === "completed"
                            ? "default"
                            : order.order_status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                        className="rounded-md px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide shadow-xs"
                      >
                        {order.order_status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-semibold text-foreground">
                      ₱
                      {Number(order.total).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    <TableCell className="text-right text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      {format(
                        new Date(order.created_at),
                        "MMM d, yyyy · h:mm a",
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredOrders.length === 0
              ? "No orders"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}-${Math.min(
                  page * PAGE_SIZE,
                  filteredOrders.length,
                )} of ${filteredOrders.length}`}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((previous) => previous - 1)}
            >
              Previous
            </Button>

            <span className="min-w-16 text-center text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <OrderDetailsDialog
        open={dialogOpen}
        order={selectedOrder}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedOrder(null);
          }
        }}
      />
    </>
  );
}
