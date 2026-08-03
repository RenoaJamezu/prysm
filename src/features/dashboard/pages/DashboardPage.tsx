import { toast } from "sonner";

import { useApp } from "@/app/providers/AppProvider";

import { useOrders } from "@/features/orders/hooks/useOrders";
import { createOrderItem } from "@/features/orders/types";

import ProductSelector from "../components/selector/ProductSelector";
import CurrentOrder from "../components/cart/CurrentOrder";

import { useCartStore } from "../stores/cart.store";
import { useOrderNotifications } from "@/features/queue/hooks/useOrderNotifications";

export default function DashboardPage() {
  const { business } = useApp();
  useOrderNotifications();

  const { createOrder, loading: saving } = useOrders();

  const addProduct = useCartStore((state) => state.addProduct);

  const items = useCartStore((state) => state.items);

  const notes = useCartStore((state) => state.notes);

  const totalAmount = useCartStore((state) => state.totalAmount());

  const clear = useCartStore((state) => state.clear);

  async function handleSaveOrder() {
    if (!business) {
      toast.error("Business not found.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      await createOrder({
        business_id: business.id,
        notes,
        subtotal: totalAmount,
        discount: 0,
        tax: 0,
        total: totalAmount,
        items: items.map((item) =>
          createOrderItem(item.product, item.quantity),
        ),
      });

      clear();
    } catch (error: any) {
      console.error("Order creation failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save order. Please try again.";

      toast.error(message);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        <ProductSelector onSelect={addProduct} />
      </div>

      <aside className="sticky top-6 self-start">
        <CurrentOrder onSaveOrder={handleSaveOrder} saving={saving} />
      </aside>
    </div>
  );
}
