import { supabase } from "./supabase";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateTicketCode(length = 4) {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
}

export async function createUniqueTicket() {
  while (true) {
    const ticket = generateTicketCode();

    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("ticket_code", ticket)
      .maybeSingle();

    if (!data) {
      return ticket;
    }
  }
}
