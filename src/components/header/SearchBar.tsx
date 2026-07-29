import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="hidden max-w-md flex-1 lg:flex">
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          placeholder="Search..."
          className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none"
        />
      </div>
    </div>
  );
}
