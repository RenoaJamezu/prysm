export interface Business {
  id: string;

  owner_id: string;

  name: string;

  business_type: string;

  logo_url: string | null;

  currency: string;

  timezone: string;

  deleted_at: string | null;

  created_at: string;

  updated_at: string;
}

export interface CreateBusinessInput {
  name: string;

  business_type: string;

  currency: string;

  logo: File | null;
}
