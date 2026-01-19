// src/supabaseClient.js
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from chatbot-backend folder (sibling to backend folder)
// Path: from src -> backend -> ShivohiniWebsitev3 -> chatbot-backend -> .env
dotenv.config({ path: join(__dirname, '..', '..', 'chatbot-backend', '.env') });

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_KEY?.trim();

console.log("→ SUPABASE_URL present:", !!SUPABASE_URL);
console.log("→ SUPABASE_SERVICE_ROLE_KEY present:", !!SUPABASE_SERVICE_ROLE_KEY);

if (!SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL is missing from environment. Make sure chatbot-backend/.env contains SUPABASE_URL."
  );
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) is missing from environment."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
