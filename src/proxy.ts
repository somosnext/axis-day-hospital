import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, publicEnv } from "@/lib/env";

export async function proxy(request: NextRequest) {
  if (!hasSupabaseEnv) {
    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = request.nextUrl.pathname === "/admin/login";

    if (isAdminPage && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
