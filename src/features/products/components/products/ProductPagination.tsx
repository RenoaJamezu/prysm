import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProductPaginationProps = {
  page: number;
  totalPages: number;

  onPageChange(page: number): void;
};

export default function ProductPagination({
  page,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    }
  }

  const visiblePages = pages.filter(
    (page, index) => index === 0 || page !== pages[index - 1],
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((number) => (
        <Button
          key={number}
          size="icon"
          variant={number === page ? "default" : "outline"}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
