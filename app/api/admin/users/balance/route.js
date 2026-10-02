import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "../../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
export const dynamic = "force-dynamic";

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

    // Balance and its immutable ledger record must be changed in the same
    // database transaction.  A read/update/rollback sequence races under
    // concurrent adjustments, so this endpoint only invokes the RPC.
    const referenceId = crypto.randomUUID();
    const { data: adjustment, error: adjustmentError } = await supabaseAdmin.rpc(
      "adjust_admin_balance",
      {
        p_user_id: userId,
        p_amount: amount,
        p_admin_auth_user_id: user.id,
        p_reference_id: referenceId,
      }
    );

    if (adjustmentError) {
      const status = adjustmentError.message?.toLowerCase().includes("saldo tidak cukup") ? 400 : 500;
      return NextResponse.json(
        { success: false, error: adjustmentError.message || "Gagal mengubah saldo." },
        { status }
      );
    }

    const { data: updatedUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, auth_user_id, email, balance")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    return NextResponse.json({
      success: true,
      user: updatedUser,
      transaction: {
        amount,
        balance_before: Number(adjustment?.balance_before),
        balance_after: Number(adjustment?.balance_after),
        reference_id: referenceId,
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
