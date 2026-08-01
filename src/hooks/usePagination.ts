import { useEffect, useMemo, useState } from "react";

type UsePaginationOptions<T> = {
  items: T[];
  pageSize?: number;
};

export function usePagination<T>({
  items,
  pageSize = 12,
}: UsePaginationOptions<T>) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;

    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function next() {
    setPage((previous) => Math.min(previous + 1, totalPages));
  }

  function previous() {
    setPage((previous) => Math.max(previous - 1, 1));
  }

  function goTo(pageNumber: number) {
    setPage(Math.min(Math.max(pageNumber, 1), totalPages));

    const container =
      document.querySelector("main") ||
      document.querySelector(".overflow-auto");

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return {
    page,
    totalPages,
    currentItems,

    next,
    previous,
    goTo,
  };
}
