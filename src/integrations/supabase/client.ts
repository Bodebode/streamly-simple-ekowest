import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yuisywwlzorzdrzvjlvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aXN5d3dsem9yemRyenZqbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzQxNzYsImV4cCI6MjA1MTUxMDE3Nn0.2dgv7ek0pBEMd9tPdg0OMjltAEHNK1BTJvCkaluXzyk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);