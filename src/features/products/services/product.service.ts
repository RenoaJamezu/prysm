import { supabase } from "@/lib/supabase";

import type { Product, ProductInput } from "../types";

const TABLE = "products";
const BUCKET = "product-assets";

export const productService = {
  getAll,
  create,
  update,
  remove,
  updateVisibility,

  uploadImage,
  getImageUrl,
};

async function getAll(businessId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("business_id", businessId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as Product[];
}

async function create(
  businessId: string,
  input: ProductInput,
): Promise<Product> {
  const { data: product, error: createError } = await supabase
    .from(TABLE)
    .insert({
      business_id: businessId,
      category_id: input.category_id,
      name: input.name.trim(),
      selling_price: input.selling_price,
      unit_cost: input.unit_cost,
      is_visible: input.is_visible,
      image_url: null,
    })
    .select()
    .single();

  if (createError) {
    throw createError;
  }

  if (!input.image_url) {
    return product as Product;
  }

  const imagePath = await uploadImage(businessId, product.id, input.image_url);

  const { error: updateError } = await supabase
    .from(TABLE)
    .update({
      image_url: imagePath,
    })
    .eq("id", product.id);

  if (updateError) {
    await supabase.storage.from(BUCKET).remove([imagePath]);

    throw updateError;
  }

  return {
    ...product,
    image_url: imagePath,
  } as Product;
}

async function update(
  businessId: string,
  id: string,
  input: ProductInput,
): Promise<Product> {
  let imagePath: string | null = null;

  if (input.image_url) {
    imagePath = await uploadImage(businessId, id, input.image_url);
  }

  const payload: Partial<Product> = {
    category_id: input.category_id,
    name: input.name.trim(),
    selling_price: input.selling_price,
    unit_cost: input.unit_cost,
    is_visible: input.is_visible,
  };

  if (imagePath) {
    payload.image_url = imagePath;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
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

async function updateVisibility(
  id: string,
  isVisible: boolean,
): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      is_visible: isVisible,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}

async function uploadImage(
  businessId: string,
  productId: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Product image must be an image.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";

  const path = `${businessId}/${productId}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return path;
}

function getImageUrl(path: string | null) {
  if (!path) {
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return data.publicUrl;
}
