import { Textarea } from "@/components/ui/textarea";

import { useCartStore } from "../../stores/cart.store";

export default function OrderNotes() {
  const notes = useCartStore((state) => state.notes);

  const setNotes = useCartStore((state) => state.setNotes);

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Note (optional)..."
        className="min-h-24 resize-none p-2"
        maxLength={500}
      />

      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {notes.length}/500
        </span>
      </div>
    </div>
  );
}
