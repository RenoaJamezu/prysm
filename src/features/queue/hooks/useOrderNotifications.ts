import { useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

import { useApp } from "@/app/providers/AppProvider";
import { playCancelledSound, playCompletedSound } from "@/lib/sound";

export function useOrderNotifications() {
  const { business } = useApp();

  useEffect(() => {
    console.log("Dashboard notifications mounted"); // 👈 1

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
          console.log("Realtime payload:", payload); // 👈 2

          const oldOrder = payload.old as {
            order_status: string;
          };

          const newOrder = payload.new as {
            order_status: string;
            ticket_code: string;
          };

          console.log("Old:", oldOrder); // 👈 3
          console.log("New:", newOrder); // 👈 4

          if (
            oldOrder.order_status === "preparing" &&
            newOrder.order_status === "completed"
          ) {
            console.log("Completed notification fired"); // 👈 5

            playCompletedSound();

            toast.success(`Ticket ${newOrder.ticket_code} is ready.`);
          }

          if (
            oldOrder.order_status === "preparing" &&
            newOrder.order_status === "cancelled"
          ) {
            console.log("Cancelled notification fired"); // 👈 6

            playCancelledSound();

            toast.error(`Ticket ${newOrder.ticket_code} was cancelled.`);
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status); // 👈 7
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business]);
}