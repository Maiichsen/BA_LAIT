import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types.ts';
import { mockSupabase } from './mockClient.ts';

type Client = ReturnType<typeof createClient<Database>>;

// The Supabase project is shut down; VITE_DEMO=true runs the app on in-memory seed data instead
export const isDemo = import.meta.env.VITE_DEMO === 'true';

export const supabase: Client = isDemo
	? (mockSupabase as unknown as Client)
	: createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
