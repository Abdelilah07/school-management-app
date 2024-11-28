import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vihcbxmauwbdewlcsfiu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaGNieG1hdXdiZGV3bGNzZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMDM2MDgsImV4cCI6MjA0NjY3OTYwOH0.n4AXRhgnyOzL3MdD4aKvZ_DSrVMi_YcuYOELvWV9KdI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    },
});