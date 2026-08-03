import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

import { useApp } from "@/app/providers/AppProvider";

import { analyticsService } from "../services/analytics.service";

import type {
  AnalyticsFilter,
  AnalyticsOrder,
  AnalyticsOverview,
  SalesTrendPoint,
} from "../types";

export function useAnalytics() {
  const { business } = useApp();

  const [filter, setFilter] = useState<AnalyticsFilter>("today");

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);

  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);

  const [trend, setTrend] = useState<SalesTrendPoint[]>([]);

  const [loading, setLoading] = useState(true);

  const range = useMemo(() => {
    const now = new Date();

    switch (filter) {
      case "today":
        return {
          from: startOfDay(now),
          to: endOfDay(now),
        };

      case "yesterday": {
        const yesterday = subDays(now, 1);

        return {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        };
      }

      case "week":
        return {
          from: startOfWeek(now),
          to: endOfWeek(now),
        };

      case "month":
        return {
          from: startOfMonth(now),
          to: endOfMonth(now),
        };

      default:
        return {
          from: startOfDay(now),
          to: endOfDay(now),
        };
    }
  }, [filter]);

  const refresh = useCallback(async () => {
    if (!business) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const from = range.from.toISOString();
      const to = range.to.toISOString();

      const [overviewResult, ordersResult, trendResult] = await Promise.all([
        analyticsService.getOverview(business.id, from, to),

        analyticsService.getOrders(business.id, from, to),

        analyticsService.getSalesTrend(business.id, from, to, filter),
      ]);

      setOverview(overviewResult);

      setOrders(ordersResult);

      setTrend(trendResult);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [business, filter, range]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,

    filter,
    setFilter,

    overview,

    orders,

    trend,

    refresh,
  };
}
