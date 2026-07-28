import { supabase } from "@/lib/supabase";

import type { Business, CreateBusinessInput } from "../types";

const TABLE = "businesses";
const BUCKET = "business-assets";

export const businessService = {
  create,
  getMine,
};

async function create(input: CreateBusinessInput): Promise<Business> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data: business, error: createError } = await supabase
    .from(TABLE)
    .insert({
      owner_id: user.id,
      name: input.name,
      business_type: input.business_type,
      currency: input.currency,
      timezone: "Asia/Manila",
      logo_url: null,
    })
    .select()
    .single();

  if (createError) {
    throw createError;
  }

  if (!input.logo) {
    return business as Business;
  }

  const logoPath = await uploadLogo(business.id, input.logo);

  const { error: updateError } = await supabase
    .from(TABLE)
    .update({
      logo_url: logoPath,
    })
    .eq("id", business.id);

  if (updateError) {
    await supabase.storage.from(BUCKET).remove([logoPath]);

    throw updateError;
  }

  return {
    ...business,
    logo_url: logoPath,
  } as Business;
}

async function getMine(): Promise<Business | null> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("owner_id", user.id)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw error;
  }

  return data as Business;
}

async function uploadLogo(businessId: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Logo must be an image.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";

  const path = `${businessId}/logo.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return path;
}
