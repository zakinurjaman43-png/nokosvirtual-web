import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              request.cookies.set(
                name,
                value,
                options
              );
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmails =
    process.env.ADMIN_EMAILS
      ?.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) || [];

  const userEmail =
    user?.email?.trim().toLowerCase();

  // Hanya proteksi halaman /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Belum login
    if (!user) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // Sudah login tapi bukan admin
    if (
      !userEmail ||
      !adminEmails.includes(userEmail)
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
