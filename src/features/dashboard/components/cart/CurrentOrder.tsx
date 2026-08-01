import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

import { useCartStore } from "../../stores/cart.store";

import CartItem from "./CartItem";
import EmptyOrder from "./EmptyCart";
import OrderNotes from "./OrderNotes";
import OrderSummary from "./OrderSummary";
import OrderActions from "./OrderActions";
import { useEffect, useRef } from "react";

type CurrentOrderProps = {
  onSaveOrder: () => Promise<void>;
  saving: boolean;
};

export default function CurrentOrder({
  onSaveOrder,
  saving,
}: CurrentOrderProps) {
  const items = useCartStore((state) => state.items);

  const lastItemRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    lastItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [items.length, totalItems]);

  return (
    <Card className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden p-0">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-semibold">Current Order</h2>

        <p className="text-sm text-muted-foreground">
          Review items before sending to the kitchen.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        {items.length === 0 ? (
          <EmptyOrder />
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-3 p-5">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  ref={index === items.length - 1 ? lastItemRef : undefined}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="space-y-5 border-t p-5">
        <OrderSummary />

        <OrderNotes />
        
        <OrderActions onSaveOrder={onSaveOrder} saving={saving} />
      </div>
    </Card>
  );
}
