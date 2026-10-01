import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

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

export async function POST(request) {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
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

    const userId = Number(
      body.user_id
    );

    const amount = Number(
      body.amount
    );

    if (
      !Number.isInteger(userId) ||
      !Number.isInteger(amount) ||
      amount === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User ID atau nominal saldo tidak valid.",
        },
        { status: 400 }
      );
    }

    const {
      data: targetUser,
      error: findError,
    } =
      await supabaseAdmin
        .from("users")
        .select("id, balance")
        .eq("id", userId)
        .single();

    if (
      findError ||
      !targetUser
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const currentBalance =
      Number(
        targetUser.balance || 0
      );

    const newBalance =
      currentBalance + amount;

    if (newBalance < 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Saldo tidak boleh menjadi negatif.",
        },
        { status: 400 }
      );
    }

    const {
      data: updatedUser,
      error: updateError,
    } =
      await supabaseAdmin
        .from("users")
        .update({
          balance: newBalance,
        })
        .eq("id", userId)
        .select("id, balance")
        .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "ADMIN BALANCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengubah saldo.",
      },
      { status: 500 }
    );
  }
}
