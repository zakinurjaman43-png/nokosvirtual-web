import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
export const dynamic = "force-dynamic";

function getMidtransBaseUrl() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

export async function POST(request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      return NextResponse.json(
        {
          success: false,
          error: "MIDTRANS_SERVER_KEY belum diset di Railway.",
        },
        { status: 500 }
      );
    }

    // =========================
    // CEK LOGIN USER
    // =========================

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

    // =========================
    // AMBIL NOMINAL
    // =========================

    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isInteger(amount) || amount < 15000) {
      return NextResponse.json(
        {
          success: false,
          error: "Minimum deposit Rp15.000.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CARI USER DI DATABASE
    // =========================

    const { data: account, error: accountError } =
      await supabaseAdmin
        .from("users")
        .select(
          "id, auth_user_id, email, balance, is_active"
        )
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (accountError) {
      throw accountError;
    }

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akun belum tersinkron. Buka dashboard dulu.",
        },
        { status: 400 }
      );
    }

    if (!account.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "Akun tidak aktif.",
        },
        { status: 403 }
      );
    }

    // =========================
    // BUAT ORDER ID
    // =========================

    const orderId =
      "NV-" +
      Date.now() +
      "-" +
      crypto.randomUUID().slice(0, 8);

    // =========================
    // SIMPAN DEPOSIT PENDING
    // =========================

    const { data: deposit, error: depositError } =
      await supabaseAdmin
        .from("deposits")
        .insert({
          user_id: account.id,
          auth_user_id: user.id,
          order_id: orderId,
          amount: amount,
          status: "pending",
        })
        .select("*")
        .single();

    if (depositError) {
      throw depositError;
    }

    // =========================
    // REQUEST KE MIDTRANS
    // =========================

    const auth = Buffer.from(
      serverKey + ":"
    ).toString("base64");

    const response = await fetch(
      getMidtransBaseUrl() + "/v2/charge",
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + auth,
        },

        body: JSON.stringify({
          payment_type: "qris",

          transaction_details: {
            order_id: orderId,
            gross_amount: amount,
          },

          customer_details: {
            email: user.email || undefined,
          },

          qris: {
            acquirer: "gopay",
          },
        }),

        cache: "no-store",
      }
    );

    const midtrans = await response.json();

    // =========================
    // CEK RESPONSE MIDTRANS
    // =========================

    if (
      !response.ok ||
      !midtrans.transaction_id
    ) {
      await supabaseAdmin
        .from("deposits")
        .update({
          status: "failed",
        })
        .eq("id", deposit.id);

      return NextResponse.json(
        {
          success: false,
          error:
            midtrans.status_message ||
            "Gagal membuat QRIS Midtrans.",
        },
        { status: 502 }
      );
    }

    // =========================
    // AMBIL URL QR
    // =========================

    const qrAction =
      (midtrans.actions || []).find(
        (action) =>
          action.name ===
          "generate-qr-code-v2"
      ) ||
      (midtrans.actions || []).find(
        (action) =>
          action.name ===
          "generate-qr-code"
      );

    const qrUrl = qrAction?.url || null;

    // =========================
    // UPDATE DEPOSIT
    // =========================

    await supabaseAdmin
      .from("deposits")
      .update({
        transaction_id:
          midtrans.transaction_id,

        qr_url: qrUrl,
      })
      .eq("id", deposit.id);

    // =========================
    // RESPONSE KE WEBSITE
    // =========================

    return NextResponse.json({
      success: true,

      deposit: {
        id: deposit.id,

        order_id: orderId,

        transaction_id:
          midtrans.transaction_id,

        amount: amount,

        status:
          midtrans.transaction_status ||
          "pending",

        qr_url: qrUrl,
      },
    });

  } catch (error) {
    console.error(
      "DEPOSIT CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal membuat pembayaran.",
      },
      { status: 500 }
    );
  }
}
