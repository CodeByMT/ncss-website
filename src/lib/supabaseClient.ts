import { createClient } from "@supabase/supabase-js";

// Safe resolve from either process.env (bundler defined) or import.meta.env (Vite native)
const getEnvVar = (key: string): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  const importMetaAny = import.meta as any;
  if (importMetaAny.env && importMetaAny.env[key]) {
    return importMetaAny.env[key] as string;
  }
  return "";
};

const supabaseUrl = getEnvVar("VITE_SUPABASE_URL") || getEnvVar("NEXT_PUBLIC_SUPABASE_URL") || "";
const supabaseAnonKey = getEnvVar("VITE_SUPABASE_ANON_KEY") || getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY") || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration keys are missing. Please verify your environment variables.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);
