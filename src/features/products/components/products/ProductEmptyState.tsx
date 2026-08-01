import { Button } from "@/components/ui/button";

type ProductEmptyStateProps = {
  search?: string;
  onCreateProduct?: () => void;
};

export default function ProductEmptyState({
  onCreateProduct,
}: ProductEmptyStateProps) {
  return (
    <div className="flex min-h-105 items-center justify-center rounded-2xl border border-dashed bg-card">
      <div className="space-y-3 text-center">
        <div className="text-5xl">☕</div>

        <h2 className="text-xl font-semibold">No products yet</h2>

        <p className="max-w-sm text-sm text-muted-foreground">
          Create your first product to start selling. Products will appear here
          once added.
        </p>

        <Button onClick={onCreateProduct}>Create Product</Button>
      </div>
    </div>
  );
}
