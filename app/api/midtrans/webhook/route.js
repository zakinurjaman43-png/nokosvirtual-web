import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
export const dynamic = "force-dynamic";

function getSignature(
  orderId,
  statusCode,
  grossAmount,
  serverKey
) {
  return crypto
    .createHash("sha512")
    .update(
      orderId +
        statusCode +
        grossAmount +
        serverKey
    )
    .digest("hex");
}

function safeEqual(a, b) {
  if (!a || !b) return false;

  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (
    aBuffer.length !==
    bBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}

export async function POST(request) {
  try {
    // =========================
    // SERVER KEY
    // =========================

    const serverKey =
      process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      console.error(
        "MIDTRANS WEBHOOK: SERVER KEY MISSING"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    // =========================
    // AMBIL NOTIFICATION
    // =========================

    const body =
      await request.json();

    const orderId =
      body.order_id;

    const statusCode =
      String(
        body.status_code || ""
      );

    const grossAmount =
      String(
        body.gross_amount || ""
      );

    const signatureKey =
      body.signature_key;

    const transactionStatus =
      body.transaction_status;

    const transactionId =
      body.transaction_id ||
      null;

    if (
      !orderId ||
      !statusCode ||
      !grossAmount ||
      !signatureKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Notification tidak lengkap.",
        },
        { status: 400 }
      );
    }

    // =========================
    // VERIFIKASI SIGNATURE
    // =========================

    const expectedSignature =
      getSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey
      );

    if (
      !safeEqual(
        signatureKey,
        expectedSignature
      )
    ) {
      console.error(
        "MIDTRANS WEBHOOK: INVALID SIGNATURE",
        orderId
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid signature.",
        },
        { status: 401 }
      );
    }

    // =========================
    // CARI DEPOSIT
    // =========================

    const {
      data: deposit,
      error: depositError,
    } =
      await supabaseAdmin
        .from("deposits")
        .select("*")
        .eq(
          "order_id",
          orderId
        )
        .maybeSingle();

    if (depositError) {
      throw depositError;
    }

    if (!deposit) {
      console.error(
        "MIDTRANS WEBHOOK: DEPOSIT NOT FOUND",
        orderId
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Deposit tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // =========================
    // CEK NOMINAL
    // =========================

    const notificationAmount =
      Number(
        grossAmount
      );

    const depositAmount =
      Number(
        deposit.amount
      );

    if (
      !Number.isInteger(
        notificationAmount
      ) ||
      notificationAmount !==
        depositAmount
    ) {
      console.error(
        "MIDTRANS WEBHOOK: AMOUNT MISMATCH",
        {
          orderId,
          notificationAmount,
          depositAmount,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Nominal pembayaran tidak sesuai.",
        },
        { status: 400 }
      );
    }

    // =========================
    // PAYMENT BERHASIL
    // =========================

    if (
      transactionStatus ===
        "settlement" &&
      statusCode === "200"
    ) {
      const {
        data: result,
        error: settleError,
      } =
        await supabaseAdmin.rpc(
          "settle_deposit",
          {
            p_order_id:
              orderId,

            p_transaction_id:
              transactionId,

            p_paid_at:
              new Date().toISOString(),
          }
        );

      if (settleError) {
        throw settleError;
      }

      console.log(
        "MIDTRANS DEPOSIT SETTLED",
        {
          orderId,
          transactionId,
          amount:
            depositAmount,
          result,
        }
      );

      return NextResponse.json({
        success: true,
        message:
          "Deposit berhasil diproses.",
        result,
      });
    }

    // =========================
    // PAYMENT EXPIRED
    // =========================

    if (
      transactionStatus ===
      "expire"
    ) {
      await supabaseAdmin
        .from("deposits")
        .update({
          status: "expire",
          transaction_id:
            transactionId,
        })
        .eq(
          "order_id",
          orderId
        )
        .neq(
          "status",
          "settlement"
        );

      return NextResponse.json({
        success: true,
        message:
          "Deposit expired.",
      });
    }

    // =========================
    // PAYMENT DENIED
    // =========================

    if (
      transactionStatus ===
        "deny" ||
      transactionStatus ===
        "cancel" ||
      transactionStatus ===
        "failed"
    ) {
      await supabaseAdmin
        .from("deposits")
        .update({
          status:
            transactionStatus,
          transaction_id:
            transactionId,
        })
        .eq(
          "order_id",
          orderId
        )
        .neq(
          "status",
          "settlement"
        );

      return NextResponse.json({
        success: true,
        message:
          "Status deposit diperbarui.",
      });
    }

    // =========================
    // STATUS LAIN
    // =========================

    return NextResponse.json({
      success: true,
      message:
        "Notification diterima.",
      status:
        transactionStatus ||
        "unknown",
    });
  } catch (error) {
    console.error(
      "MIDTRANS WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
