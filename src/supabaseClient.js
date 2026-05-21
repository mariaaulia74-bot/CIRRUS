import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJud211ZHptem9kZHZmZnJ1dmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMTE3OTQsImV4cCI6MjA5NDg4Nzc5NH0.91GBDDYHoCB-nKLB0-gG9rF1nVbw9tvYU4J_JJ_SXKo";

export const supabase = createClient(supabaseUrl, supabaseKey);