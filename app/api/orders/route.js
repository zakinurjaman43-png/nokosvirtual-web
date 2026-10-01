import { NextResponse } from "next/server";
import crypto from "crypto";

import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const SMSCODE_BASE_URL = "https://api.smscode.gg/v1";

async function smsRequest(path, options = {}) {
  const response = await fetch(
    `${SMSCODE_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      success: false,
      message:
        text || "Response SMSCode tidak valid.",
    };
  }

  return {
    response,
    data,
  };
}

export async function POST(request) {
  let reservationId = null;
  let supplierOrderCreated = false;

  try {
    // ==================================================
    // AUTH
    // ==================================================

    const supabase =
      await createSupabaseServerClient();

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

    // ==================================================
    // INPUT
    // ==================================================

    const body =
      await request.json();

    const productId =
      Number(body.product_id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "product_id tidak valid.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // USER DATABASE
    // ==================================================

    const {
      data: dbUser,
      error: userError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id, auth_user_id, balance, is_active"
        )
        .eq(
          "auth_user_id",
          user.id
        )
        .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akun belum tersinkronisasi.",
        },
        { status: 404 }
      );
    }

    if (dbUser.is_active === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akun tidak aktif.",
        },
        { status: 403 }
      );
    }

    // ==================================================
    // AMBIL PRODUK REAL DARI SMSCODE
    // ==================================================

    const productResult =
      await smsRequest(
        "/catalog/products?limit=10000&page=1"
      );

    if (
      !productResult.response.ok ||
      !productResult.data?.success
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            productResult.data?.message ||
            "Gagal mengecek produk SMSCode.",
        },
        { status: 502 }
      );
    }

    const product =
      (
        productResult.data.data ||
        []
      ).find(
        (item) =>
          String(item.id) ===
          String(productId)
      );

    if (
      !product ||
      product.active === false
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Produk sudah tidak tersedia.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // CEK STOCK
    // ==================================================

    const available =
      Number(product.available ?? 0);

    if (
      Number.isFinite(available) &&
      available <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stock nomor sedang habis.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // HARGA SUPPLIER
    // ==================================================

    const supplierPrice =
      Number(product.price);

    if (
      !Number.isFinite(
        supplierPrice
      ) ||
      supplierPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Harga supplier tidak valid.",
        },
        { status: 502 }
      );
    }

    // ==================================================
    // AMBIL MARKUP DATABASE
    // ==================================================

    const {
      data: pricing,
      error: pricingError,
    } =
      await supabaseAdmin
        .from("pricing_settings")
        .select("markup")
        .eq("id", 1)
        .maybeSingle();

    if (pricingError) {
      throw pricingError;
    }

    const markup =
      Number(
        pricing?.markup ?? 1000
      );

    if (
      !Number.isInteger(markup) ||
      markup < 0
    ) {
      throw new Error(
        "Markup pricing tidak valid."
      );
    }

    const sellingPrice =
      supplierPrice + markup;

    // ==================================================
    // IDEMPOTENCY
    // ==================================================

    const idempotencyKey =
      crypto.randomUUID();

    // ==================================================
    // RESERVE + POTONG SALDO ATOMIC
    // ==================================================

    const {
      data: reservation,
      error: reserveError,
    } =
      await supabaseAdmin.rpc(
        "reserve_purchase",
        {
          p_auth_user_id:
            user.id,

          p_user_id:
            dbUser.id,

          p_telegram_id:
            `web:${user.id}`,

          p_service_id:
            product.platform_id != null
              ? String(
                  product.platform_id
                )
              : null,

          p_country_id:
            product.country_id != null
              ? String(
                  product.country_id
                )
              : null,

          p_product_id:
            String(product.id),

          p_supplier_price:
            Math.round(
              supplierPrice
            ),

          p_price:
            Math.round(
              sellingPrice
            ),

          p_idempotency_key:
            idempotencyKey,
        }
      );

    if (reserveError) {
      // Error dari RPC seperti saldo kurang
      // diteruskan ke user.
      const message =
        reserveError.message ||
        "";

      if (
        message
          .toLowerCase()
          .includes(
            "saldo tidak cukup"
          )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Saldo tidak cukup.",
          },
          { status: 400 }
        );
      }

      throw reserveError;
    }

    reservationId =
      reservation?.id;

    if (!reservationId) {
      throw new Error(
        "Reservasi pembelian gagal dibuat."
      );
    }

    // ==================================================
    // BELI NOMOR REAL SMSCODE
    // ==================================================

    const supplier =
      await smsRequest(
        "/orders/create",
        {
          method: "POST",

          headers: {
            "Idempotency-Key":
              idempotencyKey,
          },

          body: JSON.stringify({
            product_id:
              productId,

            quantity: 1,
          }),
        }
      );

    if (
      !supplier.response.ok ||
      !supplier.data?.success
    ) {
      // Supplier gagal.
      // Refund atomic.
      await supabaseAdmin.rpc(
        "refund_purchase",
        {
          p_order_id:
            reservationId,

          p_reason:
            supplier.data?.message ||
            "Supplier menolak order.",
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            supplier.data?.message ||
            "Supplier menolak order. Saldo dikembalikan.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // RESPONSE ORDER SMSCODE
    // ==================================================

    const supplierOrder =
      supplier.data?.data
        ?.orders?.[0] ||
      supplier.data?.data;

    if (
      !supplierOrder ||
      !supplierOrder.id
    ) {
      await supabaseAdmin.rpc(
        "refund_purchase",
        {
          p_order_id:
            reservationId,

          p_reason:
            "Response SMSCode tidak berisi order ID.",
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Response SMSCode tidak valid. Saldo dikembalikan.",
        },
        { status: 502 }
      );
    }

    supplierOrderCreated =
      true;

    // ==================================================
    // UPDATE ORDER LOKAL
    // ==================================================

    const {
      data: updatedOrder,
      error: updateError,
    } =
      await supabaseAdmin
        .from("orders")
        .update({
          supplier_order_id:
            String(
              supplierOrder.id
            ),

          phone_number:
            supplierOrder.phone_number ||
            null,

          otp_code:
            supplierOrder.otp_code ||
            null,

          status:
            supplierOrder.status ||
            "ACTIVE",
        })
        .eq(
          "id",
          reservationId
        )
        .select("*")
        .single();

    if (updateError) {
      /*
       * PENTING:
       * Supplier SUDAH berhasil membuat nomor.
       *
       * JANGAN refund otomatis di sini.
       * Kalau refund dilakukan, kita bisa punya
       * nomor supplier + saldo kembali sekaligus.
       *
       * Kondisi ini harus direkonsiliasi admin.
       */
      console.error(
        "ORDER DATABASE UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          success: true,

          warning:
            "Nomor berhasil dibeli supplier tetapi sinkronisasi database gagal. Hubungi admin.",

          order: {
            id: reservationId,

            supplier_order_id:
              String(
                supplierOrder.id
              ),

            phone_number:
              supplierOrder.phone_number ||
              null,

            status:
              supplierOrder.status ||
              "ACTIVE",

            price:
              sellingPrice,
          },
        }
      );
    }

    // ==================================================
    // SUKSES
    // ==================================================

    return NextResponse.json({
      success: true,

      order:
        updatedOrder,

      balance:
        Number(
          reservation.balance_after
        ),
    });
  } catch (error) {
    console.error(
      "REAL PURCHASE ERROR:",
      error
    );

    /*
     * Hanya refund jika supplier BELUM membuat
     * order. Kalau supplier sudah membuat nomor,
     * jangan sentuh saldo.
     */
    if (
      reservationId &&
      !supplierOrderCreated
    ) {
      try {
        await supabaseAdmin.rpc(
          "refund_purchase",
          {
            p_order_id:
              reservationId,

            p_reason:
              error?.message ||
              "Purchase error",
          }
        );
      } catch (refundError) {
        console.error(
          "REFUND ERROR:",
          refundError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Gagal membuat order.",
      },
      { status: 500 }
    );
  }
}

// ==================================================
// GET ORDER USER
// ==================================================

export async function GET() {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (
      authError ||
      !user
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
    } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq(
          "telegram_id",
          `web:${user.id}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengambil pesanan.",
      },
      { status: 500 }
    );
  }
}
