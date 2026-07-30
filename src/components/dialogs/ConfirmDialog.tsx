import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;

  title: string;

  description: string;

  confirmLabel?: string;

  cancelLabel?: string;

  loading?: boolean;

  destructive?: boolean;

  onConfirm(): void | Promise<void>;

  onOpenChange(open: boolean): void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  destructive = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  async function handleConfirm() {
    await onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (loading) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
