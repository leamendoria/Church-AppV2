import { createClient } from "@supabase/supabase-js"

// This client is for server-side operations (e.g., Server Actions, Route Handlers)
// It uses environment variables directly, which are only available on the server.
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
