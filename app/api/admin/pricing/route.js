import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function isAdminEmail(email) {
  const adminEmails =
    process.env.ADMIN_EMAILS
      ?.split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean) || [];

  return (
    !!email &&
    adminEmails.includes(
      email.trim().toLowerCase()
    )
  );
}

export async function GET() {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user ||
      !isAdminEmail(user.email)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("pricing_settings")
      .select(
        "id, markup, updated_at"
      )
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pricing:
        data || {
          id: 1,
          markup: 1000,
        },
    });
  } catch (error) {
    console.error(
      "ADMIN PRICING GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengambil pricing.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user ||
      !isAdminEmail(user.email)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const markup =
      Number(body.markup);

    if (
      !Number.isInteger(markup) ||
      markup < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Markup harus berupa angka bulat 0 atau lebih.",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("pricing_settings")
      .upsert({
        id: 1,
        markup,
        updated_by: user.id,
        updated_at:
          new Date().toISOString(),
      })
      .select(
        "id, markup, updated_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pricing: data,
    });
  } catch (error) {
    console.error(
      "ADMIN PRICING POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal menyimpan pricing.",
      },
      { status: 500 }
    );
  }
}
