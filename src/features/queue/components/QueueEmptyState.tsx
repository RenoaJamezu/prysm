import { ClipboardList } from "lucide-react";

export default function QueueEmptyState() {
  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed bg-card text-center">
      <ClipboardList className="mb-4 h-14 w-14 text-muted-foreground" />

      <h3 className="text-xl font-semibold">No orders in queue</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        New orders from the POS will appear here automatically.
      </p>
    </div>
  );
}
