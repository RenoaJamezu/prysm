import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;

  title: string;

  description: string;

  buttonLabel?: string;

  onButtonClick?: () => void;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-8 py-16 text-center">
      <div className="mb-5 rounded-full bg-primary/10 p-4">
        <Icon className="h-10 w-10 text-primary" />
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {buttonLabel && (
        <Button className="mt-6" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
