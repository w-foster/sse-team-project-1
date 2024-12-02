import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lacstwcjmfdrnebmmpdl.supabase.co';
const SUPABASE_ANON_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3N0d2NqbWZkcm5lYm1tcGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTE1NzgsImV4cCI6MjA0ODEyNzU3OH0.tankWlViseqQUzaR5wxQfuJoc8WxTLl28jBOotlBPbY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_PUBLIC_KEY);

