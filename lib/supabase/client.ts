import { createClient } from "@supabase/supabase-js"

// This client is for client-side operations (e.g., React components)
// It uses a singleton pattern to ensure only one instance is created.
let supabaseClient: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
      )
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
