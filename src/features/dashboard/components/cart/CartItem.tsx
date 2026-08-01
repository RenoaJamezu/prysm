import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "../../types";

import { useCartStore } from "../../stores/cart.store";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeProduct = useCartStore((state) => state.removeProduct);

  const unitPrice = Number(item.product.selling_price);

  const total = unitPrice * item.quantity;

  return (
    <Card className="rounded-xl p-4 shadow-none">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{item.product.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            ₱
            {unitPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            each
          </p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeProduct(item.product.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => decreaseQuantity(item.product.id)}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="w-8 text-center font-semibold">{item.quantity}</span>

          <Button
            size="icon"
            variant="outline"
            onClick={() => increaseQuantity(item.product.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-lg font-bold text-primary">
          ₱
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </Card>
  );
}
