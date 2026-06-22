import { createClient } from "@supabase/supabase-js";
import process from "process";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment variables.",
  );
}

const supabaseUrl: string = process.env.SUPABASE_URL;
const supabaseKey: string = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
