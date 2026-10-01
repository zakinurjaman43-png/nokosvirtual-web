import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST() {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const webId = `web:${user.id}`;

    const { data: existingUser, error: findError } =
      await supabaseAdmin
        .from("users")
        .select("id, balance")
        .eq("telegram_id", webId)
        .maybeSingle();

    if (findError) {
      throw findError;
    }

    const { data: syncedUser, error: syncError } =
      await supabaseAdmin
        .from("users")
        .upsert(
          {
            telegram_id: webId,
            username: user.email || "-",
            first_name:
              user.user_metadata?.full_name ||
              "Pengguna Web",
            balance: Number(existingUser?.balance || 0),
            is_active: true,
          },
          {
            onConflict: "telegram_id",
          }
        )
        .select(
          "id, telegram_id, username, first_name, balance, is_active"
        )
        .single();

    if (syncError) {
      throw syncError;
    }

    return NextResponse.json({
      success: true,
      user: syncedUser,
    });
  } catch (error) {
    console.error("USER SYNC ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal sinkronisasi user",
      },
      { status: 500 }
    );
  }
}
