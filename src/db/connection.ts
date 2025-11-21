import {createClient} from '@supabase/supabase-js';
import type {Database} from '../../database.types.ts';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPPABASE_URL,
  import.meta.env.VITE_SUPPABASE_KEY,
);

