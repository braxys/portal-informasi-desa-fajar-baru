export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter((name): name is string => Boolean(name));
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. Copy .env.example to .env.local and fill in the project values.`,
    );
  }

  return { url, anonKey };
}
