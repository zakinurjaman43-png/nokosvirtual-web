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
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Semua halaman admin wajib login
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      return NextResponse.redirect(loginUrl);
    }

    // Email admin diambil dari Railway Environment Variable
    const adminEmails =
      process.env.ADMIN_EMAILS
        ?.split(",")
        .map((email) =>
          email.trim().toLowerCase()
        )
        .filter(Boolean) || [];

    const userEmail =
      user.email?.trim().toLowerCase();

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
  matcher: [
    "/admin/:path*",
  ],
};
