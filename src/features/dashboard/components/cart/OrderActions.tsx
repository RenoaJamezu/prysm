import { RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCartStore } from "../../stores/cart.store";

type OrderActionsProps = {
  onSaveOrder: () => Promise<void>;
  saving: boolean;
};

export default function OrderActions({
  onSaveOrder,
  saving,
}: OrderActionsProps) {
  const items = useCartStore((state) => state.items);

  const clear = useCartStore((state) => state.clear);

  const hasItems = items.length > 0;

  function handleClearOrder() {
    const confirmed = window.confirm("Clear the current order?");

    if (!confirmed) return;

    clear();
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" disabled={!hasItems} onClick={handleClearOrder}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Clear Order
      </Button>

      <Button disabled={saving || items.length === 0} onClick={onSaveOrder}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save Order"}
      </Button>
    </div>
  );
}
