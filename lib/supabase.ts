import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase ещё не подключён. Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY в .env.'
    );
  }

  return supabase;
}

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
