export interface Category {
  id: string;
  business_id: string;

  name: string;
  display_order: number;

  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  display_order?: number;
}

export interface Product {
  id: string;

  business_id: string;

  category_id: string | null;

  name: string;

  image_url: string | null;

  selling_price: number;

  unit_cost: number | null;

  is_visible: boolean;

  deleted_at: string | null;

  created_at: string;

  updated_at: string;
}

export interface ProductInput {
  category_id: string | null;

  name: string;

  image_url?: File | null;

  selling_price: number;

  unit_cost: number | null;

  is_visible: boolean;
}
