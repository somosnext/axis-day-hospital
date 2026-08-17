export const hasSupabaseEnv=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const publicEnv={siteUrl:process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000",supabaseUrl:process.env.NEXT_PUBLIC_SUPABASE_URL||"",supabaseAnonKey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"",gaId:process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||"",gtmId:process.env.NEXT_PUBLIC_GTM_ID||"",metaPixelId:process.env.NEXT_PUBLIC_META_PIXEL_ID||""};
export const serverEnv={supabaseServiceRoleKey:process.env.SUPABASE_SERVICE_ROLE_KEY||""};
