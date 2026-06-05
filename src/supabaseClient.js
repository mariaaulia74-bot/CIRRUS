import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rnwmudzmzoddvffruvhh.supabase.co";
const supabaseAnonKey = 'sb_publishable_33uqJif7-_6rNxbypRpDYg_QXBv0KxE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);