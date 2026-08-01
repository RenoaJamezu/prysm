import { supabase } from "@/lib/supabase";

import { businessService } from "@/features/onboarding/services/business.service";
import type { Category, CategoryInput } from "../types";

const TABLE = "categories";

export const categoryService = {
  getAll,
  create,
  update,
  remove,
};

async function getAll(): Promise<Category[]> {
  const business = await businessService.getMine();

  if (!business) {
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("business_id", business.id)
    .is("deleted_at", null)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data as Category[];
}

async function create(input: CategoryInput): Promise<Category> {
  const business = await businessService.getMine();

  if (!business) {
    throw new Error("Business not found.");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      business_id: business.id,
      name: input.name.trim(),
      display_order: input.display_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Category;
}

async function update(id: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      name: input.name.trim(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Category;
}

async function remove(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
