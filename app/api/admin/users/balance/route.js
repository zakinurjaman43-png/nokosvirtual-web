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
    // =========================
    // CEK ADMIN
    // =========================

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

    // =========================
    // AMBIL DATA
    // =========================

    const body =
      await request.json();

    const userId =
      Number(body.user_id);

    const amount =
      Number(body.amount);

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

    // =========================
    // CARI USER
    // =========================

    const {
      data: targetUser,
      error: findError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id, auth_user_id, email, balance"
        )
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

    // =========================
    // HITUNG SALDO
    // =========================

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

    // =========================
    // UPDATE SALDO
    // =========================

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
        .select(
          "id, auth_user_id, email, balance"
        )
        .single();

    if (updateError) {
      throw updateError;
    }

    // =========================
    // CATAT TRANSAKSI
    // =========================

    const transactionType =
      amount > 0
        ? "admin_add"
        : "admin_subtract";

    const description =
      amount > 0
        ? "Saldo ditambahkan oleh admin"
        : "Saldo dikurangi oleh admin";

    const {
      error: transactionError,
    } =
      await supabaseAdmin
        .from(
          "balance_transactions"
        )
        .insert({
          user_id: targetUser.id,

          auth_user_id:
            targetUser.auth_user_id ||
            null,

          type:
            transactionType,

          amount: amount,

          balance_before:
            currentBalance,

          balance_after:
            newBalance,

          reference_type:
            "admin",

          reference_id:
            user.id,

          description:
            description,
        });

    // =========================
    // JIKA TRANSAKSI GAGAL
    // =========================

    if (transactionError) {
      console.error(
        "BALANCE TRANSACTION ERROR:",
        transactionError
      );

      // Rollback saldo
      await supabaseAdmin
        .from("users")
        .update({
          balance:
            currentBalance,
        })
        .eq(
          "id",
          userId
        );

      throw transactionError;
    }

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json({
      success: true,

      user: updatedUser,

      transaction: {
        type:
          transactionType,

        amount:
          amount,

        balance_before:
          currentBalance,

        balance_after:
          newBalance,
      },
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
