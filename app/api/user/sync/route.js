import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

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

    // Cari user web berdasarkan ID Supabase Auth
    const { data: existingUser, error: findError } =
      await supabaseAdmin
        .from("users")
        .select("id, balance")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (findError) {
      throw findError;
    }

    let syncedUser;

    // Kalau belum ada, buat user baru
    if (!existingUser) {
      const { data, error: insertError } =
        await supabaseAdmin
          .from("users")
          .insert({
            auth_user_id: user.id,
            email: user.email || null,
            provider: "email",
            auth_id: user.id,
            telegram_id: `web:${user.id}`,
            balance: 0,
            is_active: true,
          })
          .select(
            "id, auth_user_id, email, balance, is_active"
          )
          .single();

      if (insertError) {
        throw insertError;
      }

      syncedUser = data;
    } else {
      // Kalau sudah ada, ambil data yang sudah tersimpan
      const { data, error: updateError } =
        await supabaseAdmin
          .from("users")
          .update({
            email: user.email || null,
            provider: "email",
            auth_id: user.id,
            is_active: true,
          })
          .eq("auth_user_id", user.id)
          .select(
            "id, auth_user_id, email, balance, is_active"
          )
          .single();

      if (updateError) {
        throw updateError;
      }

      syncedUser = data;
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
