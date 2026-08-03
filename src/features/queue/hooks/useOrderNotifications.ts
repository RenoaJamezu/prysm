import { useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

import { useApp } from "@/app/providers/AppProvider";
import { playCancelledSound, playCompletedSound } from "@/lib/sound";

export function useOrderNotifications() {
  const { business } = useApp();

  useEffect(() => {
    if (!business) return;

    const channel = supabase
      .channel(`dashboard-orders-${business.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `business_id=eq.${business.id}`,
        },
        (payload) => {
          const oldOrder = payload.old as {
            order_status: string;
          };

          const newOrder = payload.new as {
            order_status: string;
            ticket_code: string;
          };

          if (
            oldOrder.order_status === "preparing" &&
            newOrder.order_status === "completed"
          ) {
            playCompletedSound();

            toast.success(`Ticket ${newOrder.ticket_code} is ready.`);
          }

          if (
            oldOrder.order_status === "preparing" &&
            newOrder.order_status === "cancelled"
          ) {
            playCancelledSound();

            toast.error(`Ticket ${newOrder.ticket_code} was cancelled.`);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business]);
}