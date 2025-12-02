// src/supabaseClient.js
import dotenv from "dotenv";
dotenv.config(); // ensure env is loaded ASAP

import { createClient } from "@supabase/supabase-js";

// read and trim to avoid accidental whitespace
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_KEY?.trim();

// debug logs (remove after confirming it works)
console.log("→ SUPABASE_URL present:", !!SUPABASE_URL);
console.log("→ SUPABASE_SERVICE_ROLE_KEY present:", !!SUPABASE_SERVICE_ROLE_KEY);

// explicit, helpful error messages
if (!SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL is missing from environment. Make sure backend/.env contains SUPABASE_URL and the file is in the backend folder."
  );
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) is missing from environment. Use the Service Role Key for backend."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
