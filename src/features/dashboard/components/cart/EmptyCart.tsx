import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
      </div>

      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Select products from the left to start creating an order.
      </p>
    </div>
  );
}
