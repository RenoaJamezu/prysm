import { Button } from "@/components/ui/button";

import type { AnalyticsFilter } from "../types";

type DateFilterProps = {
  value: AnalyticsFilter;

  onChange(value: AnalyticsFilter): void;
};

const FILTERS: {
  label: string;
  value: AnalyticsFilter;
}[] = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "This Week",
    value: "week",
  },
  {
    label: "This Month",
    value: "month",
  },
];

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map((filter) => (
        <Button
          key={filter.value}
          variant={value === filter.value ? "default" : "outline"}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
