import{createClient}from"@supabase/supabase-js";import{publicEnv,serverEnv}from"@/lib/env";
export function createSupabaseAdminClient(){if(!serverEnv.supabaseServiceRoleKey)throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");return createClient(publicEnv.supabaseUrl,serverEnv.supabaseServiceRoleKey,{auth:{autoRefreshToken:false,persistSession:false}})}
