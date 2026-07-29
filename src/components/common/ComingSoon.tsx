import { Construction } from "lucide-react";

type ComingSoonProps = {
  title: string;
  description?: string;
};

export default function ComingSoon({
  title,
  description = "This feature is currently under development and will be available in a future update.",
}: ComingSoonProps) {
  return (
    <div className="flex h-full min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction size={36} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <p className="mt-3 text-muted-foreground">{description}</p>

        <div className="mt-8 inline-flex items-center rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
}
