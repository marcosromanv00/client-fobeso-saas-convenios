export const executeQuery = async (query, params) => {
  console.error(
    "CRITICAL: executeQuery called but lib/db implementation is missing. Migration to Supabase required.",
  );
  console.error("Query:", query);
  console.error("Params:", params);
  throw new Error(
    "Database connection not implemented. Please use Supabase client.",
  );
};
