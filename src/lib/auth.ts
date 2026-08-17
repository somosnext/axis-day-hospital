import{redirect}from"next/navigation";import{hasSupabaseEnv}from"@/lib/env";import{createSupabaseServerClient}from"@/lib/supabase/server";
export async function getStaff(){if(!hasSupabaseEnv)return null;const s=await createSupabaseServerClient();const{data:{user}}=await s.auth.getUser();if(!user)return null;const{data:profile}=await s.from("profiles").select("id,full_name,role").eq("id",user.id).maybeSingle();return profile?{...profile,email:user.email}:null}
export async function requireStaff(){const staff=await getStaff();if(!staff)redirect("/admin/login");return staff}
