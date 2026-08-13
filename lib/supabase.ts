import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DentalTool = {
  id: string;
  category: string;
  name: string;
  storage_location: string;
  description: string;
  image_url: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
};

export type DentalToolInput = {
  category: string;
  name: string;
  storage_location: string;
  description: string;
  image_url: string | null;
  tags: string[];
  sort_order: number;
};
