import { useCartStore } from "../../stores/cart.store";

export default function OrderSummary() {
  const totalItems = useCartStore((state) => state.totalItems());

  const totalAmount = useCartStore((state) => state.totalAmount());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Items</span>

        <span className="font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Total</span>

        <span className="text-2xl font-bold text-primary">
          ₱
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
