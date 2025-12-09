// import dotenv from 'dotenv';
// dotenv.config();
import {createClient} from '@supabase/supabase-js';
import type {Database} from '../../database.types.ts';

export const supabase = createClient<Database>(
  // String(process.env.VITE_SUPABASE_URL),
  // String(process.env.VITE_SUPABASE_KEY),
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
);
